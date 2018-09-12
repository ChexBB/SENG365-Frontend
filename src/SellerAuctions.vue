<template>
  <div>
    <br>
    <h1>Your Auctions</h1>
    <br>
    <div id="auctions">
      <div>
        <b-dropdown id="ddown1" :text="this.filterType" class="filterBar" size="lg">
          <b-dropdown-item-button @click="statusFilter('all')">All</b-dropdown-item-button>
          <b-dropdown-item-button @click="statusFilter('active')">In-progress</b-dropdown-item-button>
          <b-dropdown-item-button @click="statusFilter('won')">Completed with bid</b-dropdown-item-button>
          <b-dropdown-item-button @click="statusFilter('expired')">Completed without bid</b-dropdown-item-button>

        </b-dropdown>
      </div>
      <div class="card-columns">
        <div v-for="auction in auctions">
          <div class="container">
            <b-card :title="auction.title"
                    :img-src="'http://127.0.0.1:4941/api/v1/auctions/' + auction.id + '/photos'"
                    style="max-width: 20rem;"
                    class="card-img-top">

                    <router-link :to="{ name: 'auction', params: { auctionId: auction.id }}">
                      <div style="color:white">
                        <button class="btn btn-primary">Expand</button>
                      </div>
                    </router-link>

            </b-card>
          </div>
        </div>
      </div>
    </div>
    <br/><br/>
  </div>
</template>

<script>
  export default {
    data() {

      return {
        successfulBid: null,
        seen: true,
        error: "",
        errorFlag: false,
        auctions: [],
        auction: [],
        user: [],

        filterType: "Select",
        category: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        reservePrice: "",
        startingBid: "",

        username: "",
        firstName: "",
        lastName: "",
        password: "",
        email: "",
      }
    },
    mounted: function () {
      this.getAuctions();
    },

    methods: {
      getAuctions: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?seller=' + this.$route.params.sellerId, {}, {})
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getAuctionDetails: function () {
        this.$http.get("http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId, {})
          .then(function (response) {
            this.auction = response.body;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      goAuctions: function () {
        this.$router.push('/auctions')
      },

      viewUser: function (sellerId) {
        this.$http.get('http://127.0.0.1:4941/api/v1/user/' + sellerId, {}, {})
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      editAuction: function () {
        this.$http.patch('http://127.0.0.1:4941/api/v1/auctions/' + this.$route.params.auctionId, {}, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.goAuctions();
            // this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      statusFilter: function (filter) {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?seller=' + this.$route.params.sellerId + '&' + 'status=' + filter, {}, {})
          .then(function (response) {
            this.auctions = response.data;
            this.filterType = filter;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      //will need this to get all auctions from current user
      sellerFilter: function (sellerId) {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?seller=' + sellerId, {}, {})
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      onFileChanged(event) {
        this.selectedFile = event.target.files[0]
      }
    }
  }
</script>

<style scoped>

</style>
