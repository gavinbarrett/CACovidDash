import sys
import json
import time
import redis
import requests
import pandas as pd
from io import StringIO
from datetime import timedelta
from flask import Flask, render_template, send_file, jsonify

app = Flask(__name__)

# create a Redis cache
cache = redis.Redis()

# set key for cached data
data_key = 'covid-data'
# set the data source url
url = 'https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv'

def get_data():
	# check the cache for existing Covid data
	if cache.exists(data_key):
		# retrieve cached data
		return cache.get(data_key)
	# retrieve the data
	if (cache_data()):
		# data was successfully cached
		return cache.get(data_key)
	return False

def cache_data():
	# download the csv data
	resp = requests.get(url)
	# construct a Pandas dataframe
	data = resp.content.decode()
	#data = pd.read_csv(StringIO(resp.content.decode()))
	# serialize the dataframe and cache it for 12 hours
	return cache.setex(data_key, timedelta(minutes=720), value=data)

@app.route('/get_county/<county>')
def get_county(county):
	# grab cached data
	serialized_data = get_data()
	if not serialized_data:
		return json.dumps({"0": "failed"})
	# deserialize Covid data
	data = pd.read_csv(StringIO(serialized_data.decode()))
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
	# start server
	app.run(host='0.0.0.0')
