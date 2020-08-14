import sys
import json
import time
import sched
import logging
import requests
import pandas as pd
from io import StringIO
from collections import defaultdict
from flask import Flask, render_template, send_file, jsonify

app = Flask(__name__)
# create a scheduler for retrieving data daily
scheduler = sched.scheduler(time.time, time.sleep)
# create a data cache
data_cache = defaultdict(lambda: None)

def get_data():
	# retrieve the cached data
	#FIXME: update caching conditions with a timer so that we
	# pull data every day
	if data_cache['data'] is not None:
		return data_cache['data']
	# url for CA statewide Covid-19 data
	url='https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv'
	# get the csv data
	r = requests.get(url)
	# construct a Pandas dataframe
	data = pd.read_csv(StringIO(r.content.decode()))
	# cache and return our retrieved data
	data_cache['data'] = data
	#e_x = scheduler.enterabs(time.time()+1, 1, )
	return data

def cache_data():
	# retrieve the cached data
	#FIXME: update caching conditions with a timer so that we
	# pull data every day
	if data_cache['data'] is not None:
		return data_cache['data']
	# url for CA statewide Covid-19 data
	url='https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv'
	# get the csv data
	r = requests.get(url)
	# construct a Pandas dataframe
	data = pd.read_csv(StringIO(r.content.decode()))
	# cache and return our retrieved data
	data_cache['data'] = data
	print('Covid Data cached.')

@app.route('/get_counties', methods=['GET'])
def get_counties():
	counties = {"counties": ['Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa', 'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange', 'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo', 'San Mateo', 'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama', 'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba']}
	return json.dumps(counties)

@app.route('/get_county/<county>')
def get_county(county):
	# grab cached data
	data = get_data()
	# extract the county data
	county_data = data.loc[data['county'] == county]
	# the server will cache this data and retrieve new data each day
	county_data = county_data.to_dict()
	return json.dumps(county_data)

@app.route('/get_json', methods=['GET'])
def get_json():
	# retrieve recent CA Covid data
	data = get_data()
	# extract the Placer county data
	placer_data = data.loc[data['county'] == 'Sacramento']
	# the server will cache this data and retrieve new data each day
	sac_data = placer_data.to_dict()
	return json.dumps(sac_data)

@app.route('/', methods=['GET'])
def return_landing():
	return render_template('./index.html');

if __name__ == "__main__":
	# retrieve and cache the data
	cache_data()
	# start server
	app.run(threaded=True)
