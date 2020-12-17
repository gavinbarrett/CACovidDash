import sys
import json
import time
import requests
import pandas as pd
from io import StringIO
from collections import defaultdict
from flask import Flask, render_template, send_file, jsonify
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
# create a data cache
data_cache = defaultdict(lambda: None)
# set the data source url
url='https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv'

def get_data():
	# retrieve the cached data
	if data_cache['data'] is not None:
		return data_cache['data']
	# retrieve the data
	cache_data()
	# return the data dictionary
	return data_cache['data']

def cache_data():
	# get the csv data
	r = requests.get(url)
	# construct a Pandas dataframe
	data = pd.read_csv(StringIO(r.content.decode()))
	# cache and return our retrieved data
	data_cache['data'] = data
	print('Covid Data cached.')

@app.route('/get_county/<county>')
def get_county(county):
	# grab cached data
	data = get_data()
	if county == 'Statewide':
		# return the Covid data for all of California
		state_data = data.groupby('date', as_index=False).agg({"newcountconfirmed":"sum","newcountdeaths":"sum","totalcountconfirmed":"sum","totalcountdeaths":"sum"})
		return json.dumps(state_data.to_dict())
	# extract the county data
	county_data = data.loc[data['county'] == county]
	# the server will cache this data and retrieve new data each day
	return json.dumps(county_data.to_dict())

@app.route('/', methods=['GET'])
def return_landing():
	return render_template('./index.html');

def setup_scheduler():
	# initialize a scheduler
	scheduler = BackgroundScheduler()
	# set the scheduler to pull data and cache it every day
	scheduler.add_job(func=cache_data, trigger="interval", seconds=86400)
	# start the scheduler
	scheduler.start()

if __name__ == "__main__":
	# retrieve and cache the data
	cache_data()
	# start the scheduler
	setup_scheduler()
	# start server
	app.run(host='0.0.0.0')
