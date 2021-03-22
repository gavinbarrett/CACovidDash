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
url = "https://data.chhs.ca.gov/dataset/f333528b-4d38-4814-bebb-12db1f10f535/resource/046cdd2b-31e5-4d34-9ed3-b48cdbc4be7a/download/covid19cases_test.csv"

def clean_data(data):
	''' Clean the data '''
	# set all null case data to 0
	data['cases'] = data['cases'].fillna(0)
	data['cumulative_cases'] = data['cumulative_cases'].fillna(0)
	data['deaths'] = data['deaths'].fillna(0)
	data['cumulative_deaths'] = data['cumulative_deaths'].fillna(0)
	data['total_tests'] = data['total_tests'].fillna(0)
	data['cumulative_total_tests'] = data['cumulative_total_tests'].fillna(0)
	data['positive_tests'] = data['positive_tests'].fillna(0)
	data['cumulative_postive_tests'] = data['cumulative_positive_tests'].fillna(0)
	data['reported_cases'] = data['reported_cases'].fillna(0)
	data['cumulative_reported_cases'] = data['cumulative_reported_cases'].fillna(0)
	data['reported_deaths'] = data['reported_deaths'].fillna(0)
	data['cumulative_reported_deaths'] = data['cumulative_reported_deaths'].fillna(0)
	data['reported_tests'] = data['reported_tests'].fillna(0)
	data['cumulative_reported_tests'] = data['cumulative_reported_tests'].fillna(0)
	
	# split state and county data
	county_d = data.loc[data['area_type'] == 'County']
	state_d = data.loc[data['area_type'] == 'State']
	
	# drop NaN dates
	county_d = county_d.dropna(subset=['date'])
	state_d = state_d.dropna(subset=['date'])

	# set null population fields to the mean
	# FIXME: don't take the mean of both county and state data
	county_d['population'] = county_d['population'].fillna(county_d['population'].mean())
	state_d['population'] = state_d['population'].fillna(state_d['population'].mean())
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
		rdata.sort_values(by=['date'])
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
		rdata = pdata.loc[pdata['area'] == county]
		rdata.sort_values(by=['date'])
		rdata.reset_index(inplace=True)
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
	# set cache data function to run every 360 minutes (6 hours)
	scheduler.add_job(cache_data, 'interval', seconds=21600)
	scheduler.start()
	# start server
	app.run(host='0.0.0.0')
