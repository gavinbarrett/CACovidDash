import sys
import json
import time
import redis
import requests
import pandas as pd
from io import StringIO
from datetime import timedelta
from flask import Flask, render_template, send_file, jsonify
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)

# create a Redis cache
cache = redis.Redis()

# set the data source url
url = 'https://data.chhs.ca.gov/dataset/f333528b-4d38-4814-bebb-12db1f10f535/resource/046cdd2b-31e5-4d34-9ed3-b48cdbc4be7a/download/vw_cases_withcumulative.csv'

def clean_data(data):
	''' Clean the data '''
	# set all null case data to 0
	data['CASES'] = data['CASES'].fillna(0)
	data['CUMULATIVE_CASES'] = data['CUMULATIVE_CASES'].fillna(0)
	data['DEATHS'] = data['DEATHS'].fillna(0)
	data['CUMULATIVE_DEATHS'] = data['CUMULATIVE_DEATHS'].fillna(0)
	data['TOTAL_TESTS'] = data['TOTAL_TESTS'].fillna(0)
	data['CUMULATIVE_TOTAL_TESTS'] = data['CUMULATIVE_TOTAL_TESTS'].fillna(0)
	data['POSITIVE_TESTS'] = data['POSITIVE_TESTS'].fillna(0)
	data['CUMULATIVE_POSITIVE_TESTS'] = data['CUMULATIVE_POSITIVE_TESTS'].fillna(0)
	data['REPORTED_CASES'] = data['REPORTED_CASES'].fillna(0)
	data['CUMULATIVE_REPORTED_CASES'] = data['CUMULATIVE_REPORTED_CASES'].fillna(0)
	data['REPORTED_DEATHS'] = data['REPORTED_DEATHS'].fillna(0)
	data['CUMULATIVE_REPORTED_DEATHS'] = data['CUMULATIVE_REPORTED_DEATHS'].fillna(0)
	data['REPORTED_TESTS'] = data['REPORTED_TESTS'].fillna(0)
	data['CUMULATIVE_REPORTED_TESTS'] = data['CUMULATIVE_REPORTED_TESTS'].fillna(0)
	
	# split state and county data
	county_d = data.loc[data['AREA_TYPE'] == 'County']
	state_d = data.loc[data['AREA_TYPE'] == 'State']
	
	# drop NaN dates
	county_d = county_d.dropna(subset=['DATE'])
	state_d = state_d.dropna(subset=['DATE'])

	# set null population fields to the mean
	# FIXME: don't take the mean of both county and state data
	county_d['POPULATION'] = county_d['POPULATION'].fillna(county_d['POPULATION'].mean())
	state_d['POPULATION'] = state_d['POPULATION'].fillna(state_d['POPULATION'].mean())
	return county_d, state_d

def cache_clean_data(data):
	''' Clean data and cache it '''
	county, state = clean_data(data)
	# insert county data into Redis cache
	set_county = cache.setex('County', timedelta(minutes=720), value=county.to_csv())
	# insert county data into Redis cache
	set_state = cache.setex('State', timedelta(minutes=720), value=state.to_csv())
	return set_county, set_state

def get_state_data():
	# check the cache for existing Covid data
	if cache.exists('State'):
		# retrieve cached data
		return cache.get('State')
	# retrieve the data
	county, state = cache_data()
	if (state):
		# data was successfully cached
		return cache.get('State')
	return False

def get_county_data():
	# check the cache for existing Covid data
	if cache.exists('County'):
		# retrieve cached data
		return cache.get('County')
	# retrieve the data
	county, state = cache_data()
	if (county):
		# data was successfully cached
		return cache.get('County')
	return False

def cache_data():
	# download the csv data
	resp = requests.get(url)
	# construct a Pandas dataframe
	pdata = pd.read_csv(StringIO(resp.content.decode()))
	# serialize the dataframe and cache it for 12 hours
	return cache_clean_data(pdata)

@app.route('/get_state/')
def get_state():
	data = get_state_data()
	if data:
		pdata = pd.read_csv(StringIO(data.decode()))
		pdata.reset_index(inplace=True)
		return json.dumps({"data": pdata.to_dict()})
	else:
		print(f'No data retrieved.')
	return json.dumps({"0": "failed"})

@app.route('/get_county/<county>')
def get_county(county):
	data = get_county_data()
	if data:
		pdata = pd.read_csv(StringIO(data.decode()))
		rdata = pdata.loc[pdata['AREA'] == county]
		rdata.reset_index(inplace=True)
		print(rdata)
		return json.dumps({"data": rdata.to_dict()})
	else:
		print(f'No data retrieved.')
	return json.dumps({"0": "failed"})

@app.route('/', methods=['GET'])
def return_landing():
	return render_template('./index.html');

if __name__ == "__main__":
	# retrieve and cache the data
	cache_data()
	scheduler = BackgroundScheduler()
	# set cache data function to run every 720 minutes (12 hours)
	scheduler.add_job(cache_data, 'interval', seconds=21600)
	scheduler.start()
	# start server
	app.run(host='0.0.0.0')
