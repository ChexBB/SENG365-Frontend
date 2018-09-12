<template>
  <div>
    <div v-if="this.errorFlag" class="alert alert-warning">
      <strong>Invalid auction!</strong>
      <p class="mb-0">
        Forms inputs are invalid!
      </p>
    </div>
    <div>
      <br>
      <h1>All Auctions</h1>
      <br>
      <!--TODO:make a modal for auction input-->
      <div v-if="this.$cookie.get('authToken')">
        <div id="adAuctionId">
          <p>
            <button class="btn btn-lg btn-primary" data-dismiss="modal" data-toggle="modal"
                    data-target="#addAuctionModal" style="width: 100%; height: 60px" >
              Create an auction
            </button>
          </p>
        </div>
      </div>
      <div class="btn-group" role="group">
        <div>
          <b-dropdown id="ddown1" :text="this.filterType" class="filterBar" size="lg">
            <b-dropdown-item-button @click="statusFilter('all')">All</b-dropdown-item-button>
            <b-dropdown-item-button @click="statusFilter('active')">Active</b-dropdown-item-button>
            <b-dropdown-item-button @click="statusFilter('expired')">Expired</b-dropdown-item-button>
            <b-dropdown-item-button @click="statusFilter('upcoming')">Upcoming</b-dropdown-item-button>
            <b-dropdown-item-button @click="statusFilter('won')">Won</b-dropdown-item-button>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown id="ddown2" :text="this.categorySearchType" class="categoryBar" size="lg">
            <b-dropdown-item-button @click="setcategorySearch('apparel')">Apparel</b-dropdown-item-button>
            <b-dropdown-item-button @click="setcategorySearch('equipment')">Equipment</b-dropdown-item-button>
            <b-dropdown-item-button @click="setcategorySearch('vehicles')">Vehicles</b-dropdown-item-button>
            <b-dropdown-item-button @click="setcategorySearch('property')">Property</b-dropdown-item-button>
            <b-dropdown-item-button @click="setcategorySearch('other')">Other</b-dropdown-item-button>
          </b-dropdown>
        </div>
        <div class="btn-group" v-if="this.$cookie.get('authId')">
          <div id="winnerAuct">
            <b-button size="lg" @click="winnerAuctions()">Auctions I've won</b-button>
          </div>
          <div id="bidsAuct">
            <b-button size="lg" @click="bidderAuctions()">Auctions I've bid on</b-button>
          </div>
        </div>
        <div id="searchbar">
          <b-nav-form>
            <b-form-input size="lg" class="mr-sm-2" type="text" placeholder="Search" v-model="search"/>
            <b-button size="lg" class="my-2 my-sm-0" type="submit" v-on:click.prevent="searchFilter">Search</b-button>
          </b-nav-form>
        </div>
      </div>
      <br>
      <div id="auctions">
        <div class="container">
          <div class="card-columns">
            <div v-for="auction in shownAuctions">
              <div>
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
      </div>
      <br><br><br>
    </div>

    <div class="modal fade" id="addAuctionModal" size="lg" tabindex="-1" role="dialog" aria-labelledby="addAuctionModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAuctionModalLabel">Create new auction</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <template>
                <b-container fluid>
                  <b-row class="my-0">
                    <b-col sm="3"><label>Category</label></b-col>
                    <b-col sm="9">
                      <b-dropdown style="width: 100%;" v-model="category" id="ddown1" :text="this.categoryType" class="m-md">
                        <b-dropdown-item-button @click="setcategoryType('apparel')">apparel</b-dropdown-item-button>
                        <b-dropdown-item-button @click="setcategoryType('equipment')">equipment</b-dropdown-item-button>
                        <b-dropdown-item-button @click="setcategoryType('vehicles')">vehicles</b-dropdown-item-button>
                        <b-dropdown-item-button @click="setcategoryType('property')">property</b-dropdown-item-button>
                        <b-dropdown-item-button @click="setcategoryType('other')">other</b-dropdown-item-button>
                      </b-dropdown>
                    </b-col>
                  </b-row>

                  <b-row class="my-1">
                    <b-col sm="12"><label>Title</label></b-col>
                    <b-form-input v-model="title" type="text" placeholder="Hello" :value="this.auction.title"></b-form-input>

                    <b-col sm="12"><label>Description</label></b-col>
                    <b-form-input v-model="description" type="text" :value="this.auction.description"></b-form-input>

                    <b-col sm="12"><label>Start Time</label></b-col>
                    <b-form-input v-model="startDate" type="datetime-local" :value="this.auction.startDate"></b-form-input>

                    <b-col sm="12"><label>End Time</label></b-col>
                    <b-form-input v-model="endDate" type="datetime-local" :value="this.auction.endDate"></b-form-input>

                    <b-col sm="12"><label>Reserve Price</label></b-col>
                    <b-form-input v-model="reservePrice" type="number" :value="this.auction.reservePrice"></b-form-input>

                    <b-col sm="12"><label>Starting Bid</label></b-col>
                    <b-form-input v-model="startingBid" type="number" :value="this.auction.startingBid"></b-form-input>

                    <b-col sm="9" style="padding:20px">
                      <div id="app">
                        <input type="file" @change="onFileChanged">
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </template>
              <button class="btn btn-primary solid blank" data-dismiss="modal">
                Cancel
              </button>
              <button class="btn btn-primary solid blank" v-on:click.prevent="createAuction()" data-dismiss="modal">
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h6></h6>
      <b-pagination align="center" :total-rows="this.auctions.length" v-model="currentPage" :per-page="5" @input="changeAuctionIndex"></b-pagination>
      <br>
    </div>
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
        shownAuctions: [],
        user: [],

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

        filterType: "all",
        categorySearchType: "category",
        categoryType: "Select",
        selectedFile: null,

        search: "",
        amount: 0,
        sortBy: 'amount',
        sortDesc: true,
        currentPage: null,

        fields: [
          {key: 'buyerUsername', label: 'Buyer'},
          {key: 'amount', label: 'Amount'},
          {key: 'datetime', label: 'Date and time'},
          {key: 'buyerId', label: 'Buyer ID'}
        ]
      }
    },
    mounted: function () {
      this.getAuctions();
    },

    methods: {
      getImageUrl: function () {
        return "http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/photos";
      },

      changeAuctionIndex: function() {
        this.shownAuctions = this.auctions.slice((this.currentPage - 1) * 5, this.currentPage * 5);
      },

      getAuctions: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      createAuction: function () {
        console.log(this.category);
        this.$http.post("http://localhost:4941/api/v1/auctions", JSON.stringify({
          "categoryId": this.category,
          "title": this.title,
          "description": this.description,
          "startDateTime": Date.parse(this.startDate),
          "endDateTime": Date.parse(this.endDate),
          "reservePrice": parseInt(this.reservePrice),
          "startingBid": parseInt(this.startingBid)
        }), {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.$router.push('/auctions/' + response.data.id)
            this.$http.post(
              'http://localhost:4941/api/v1/auctions/' + response.data.id + '/photos',
              this.selectedFile,
              {
                headers: {
                  "X-Authorization": this.$cookie.get('authToken'),
                  "Content-Type": this.selectedFile.type
                }
              }).then(response => {
              console.log("success")
            }, response => {
              console.log("error")
            });
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      goAuctions: function () {
        this.$router.push('/auctions')
      },

      statusFilter: function (filter) {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?status=' + filter, {}, {})
          .then(function (response) {
            this.auctions = response.data;
            this.filterType = filter;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      searchFilter: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?q=' + this.search, {}, {})
          .then(function (response) {
            this.auctions = response.data;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
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

      setcategoryType: function (filter) {
        this.categoryType = filter;
        if (filter === "apparel") {
          this.category = 1;
        } else if (filter === "equipment") {
          this.category = 2;
        } else if (filter === "vehicles") {
          this.category = 3;
        } else if (filter === "property") {
          this.category = 4;
        } else if (filter === "other") {
          this.category = 5;
        }
      },

      setcategorySearch: function (filter) {
        if (filter === "apparel") {
          this.category = 1;
        } else if (filter === "equipment") {
          this.category = 2;
        } else if (filter === "vehicles") {
          this.category = 3;
        } else if (filter === "property") {
          this.category = 4;
        } else if (filter === "other") {
          this.category = 5;
        }
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?category-id=' + this.category, {}, {})
          .then(function (response) {
            this.auctions = response.data;
            this.categorySearchType = filter;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      winnerAuctions: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/my_won_auctions', {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.auctions = response.data;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      bidderAuctions: function () {
        this.$http.get('http://127.0.0.1:4941/api/v1/auctions?bidder=' + this.$cookie.get('authId'), {}, {})
          .then(function (response) {
            this.auctions = response.data;
            this.changeAuctionIndex();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      onFileChanged (event) {
        this.selectedFile = event.target.files[0]
      }
    }
  }
</script>

<!--TODO: add a div tag for the td elements in the auction page-->
<style>
  td {
    padding-right: 15px;
  }

  table {
    border-collapse: collapse;
    margin-left: auto;
    margin-right: auto;

  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
    padding: 12px;
  }

  tr:hover {
    background-color: #f2f2f2;
  }

  table, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .form-control {
    margin-left: auto;
    margin-right: auto;
  }

  .my-1 label {
    font-size: 20px;
  }

  .my-0 label {
    font-size: 20px;
  }

  .btn-group {
    padding-bottom: 15px;
  }

  .filterBar {
    padding-right: 5px;
  }

  .categoryBar {
    padding-right: 5px;
  }

  #searchbar {
    margin-left: auto;
    margin-right: auto;
  }

  #winnerAuct {
    padding-right: 5px;
  }

  #bidsAuct {
    padding-right: 5px;
  }

</style>
