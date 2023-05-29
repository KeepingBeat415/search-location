<template>
  <!-- Search Location Form -->
  <div class="container mt-5" style="position: relative; z-index: 1">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-md-8">
        <form id="Form">
          <div class="form-group">
            <!-- Display Error Msg -->
            <div class="alert alert-danger" role="alert" v-show="errorMsg">{{ errorMsg }}</div>
            <div class="form-row">
              <div class="col-11">
                <input type="text" class="form-control" v-model="searchInput" @keyup.enter.prevent="searchLocation()" />
              </div>
              <div class="col" style="padding-top: 5px">
                <span id="Search-icon" @click.prevent="currentLocation()">
                  <i class="fa fa-home"></i>
                </span>
              </div>
            </div>
            <!-- Display Time Zone -->
            <div class="form-row" v-show="timeZone">
              <div class="col-11" style="padding-top: 10px">
                <span class="badge badge-pill badge-info"> Local Time: {{ this.timeDate }}, {{ this.timeZone }}</span>
              </div>
            </div>
          </div>
          <button id="Search-button" type="submit" @click.prevent="searchLocation()" v-show="!spinner">Search</button>
          <div class="spinner-border" role="status" v-show="spinner">
            <span class="sr-only">Loading...</span>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- GoogleMap -->
  <div class="container mt-5" id="Map">
    <GoogleMap :api-key="this.$API_KEY" style="width: 100%; height: 700px" :center="center" :zoom="13">
      <MarkerCluster>
        <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i" />
      </MarkerCluster>
    </GoogleMap>
  </div>
</template>

<script>
import { GoogleMap, Marker, MarkerCluster } from 'vue3-google-map';
import axios from 'axios';
import '../assets/theme.css';

export default {
  components: { GoogleMap, Marker, MarkerCluster },
  data() {
    return {
      searchInput: '',
      errorMsg: '',
      center: { lat: 45.508888, lng: -73.561668 },
      locations: [],
      timeZone: '',
      timeDate: '',
      spinner: false,
    };
  },
  methods: {
    currentLocation() {
      this.spinner = true;
      this.errorMsg = '';
      //console.log(navigator.geolocation);
      //   if (navigator.geolocation !== null) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.timeDate);
        if (position) {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.locations.push(this.center);
          this.getTimeZone(position.timeDate / 1000);
        } else {
          this.errorMsg = 'Your browser does not allow access current location.';
        }
        this.spinner = false;
      });
    },

    async searchLocation() {
      this.spinner = true;
      this.errorMsg = '';
      try {
        const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: this.searchInput,
            key: this.$API_KEY,
          },
        });

        const { results } = res.data;

        if (res.data.status == 'OK') {
          this.center = results[0].geometry.location;
          this.locations.push(this.center);
          console.log('Search Address' + this.center);
          this.getTimeZone(Date.now());
        } else {
          //   console.log('Location not found.');
          this.errorMsg = 'Location not found';
        }
        this.spinner = false;
      } catch (error) {
        console.log(error);
        this.errorMsg = error;
        this.spinner = false;
      }
    },
    async getTimeZone(time) {
      try {
        const res = await axios.get(' https://maps.googleapis.com/maps/api/timezone/json', {
          params: {
            location: this.center.lat + ',' + this.center.lng,
            timestamp: time,
            key: this.$API_KEY,
          },
        });

        if (res.data.status == 'OK') {
          this.timeZone = res.data.timeZoneId;
          // console.log(res.data.timeZoneId);
          let date = new Date(time * 1000);
          console.log(date.toLocaleString('en-GB', { timeZone: this.timeZone }));
          this.timeDate = date.toLocaleString('en-GB', { timeZone: this.timeZone });
        } else {
          //   console.log('Location time zone not found.');
          this.errorMsg = 'Location time zone not found.';
        }
      } catch (error) {
        console.log(error);
        this.errorMsg = error;
      }
    },
  },
};
</script>
