<template>
  <div>
    <div v-if="this.errorFlag" class="alert alert-warning">
      <strong>Invalid edit!</strong>
      <p class="mb-0">
        Forms inputs are invalid or auction is unavailable to edit
      </p>
    </div>
    <div id="auction">
      <br/>
      <h1>{{ auction.title }}</h1>

      <div v-if="this.$cookie.get('authToken')">

        <router-link :to="{ name: 'user', params: { userId: auction.seller.id }}">
          <div style="color:black">
            <br>
            <h4>Seller: {{ auction.seller.username }}</h4>
            <br>
          </div>
        </router-link>

        <div id="editAuc" v-if="this.$cookie.get('authId') == this.auction.seller.id">
          <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editAuction">Edit Auction
          </button>
          <!--<button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#deletePhoto">Remove photo-->
          <!--</button>-->
        </div>

        <br>
        <!--Edit Auction Modal-->
        <div class="modal fade" id="editAuction" tabindex="-1" role="dialog" aria-labelledby="editAuctionLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editAuctionLabel">Edit auction</h5>
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
                          <b-dropdown style="width: 100%;" v-model="category" id="ddown1" :text="this.categoryType"
                                      class="m-md">
                            <b-dropdown-item-button @click="setcategoryType('apparel')">apparel</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setcategoryType('equipment')">equipment
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click="setcategoryType('vehicles')">vehicles
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click="setcategoryType('property')">property
                            </b-dropdown-item-button>
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

                        <b-col style="padding:20px">
                          <div id="app">
                            <input type="file" @change="onFileChanged">
                            <button @click="onUpload">Upload!</button>
                            <br>
                            <button @click="deletePhoto">Delete</button>
                          </div>
                        </b-col>
                      </b-row>
                    </b-container>
                  </template>
                  <br>
                  <button class="btn btn-primary solid blank" data-dismiss="modal">
                    Cancel
                  </button>
                  <button class="btn btn-primary solid blank" v-on:click.prevent="editAuction()" data-dismiss="modal">
                    Confirm
                  </button>
                </form>
                <br>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else>
        <h4>Seller: {{ auction.seller.username }}</h4>
      </div>

      <img :src=this.getImageUrl() width="300px">
      <br><br>
      <h1>${{ auction.currentBid }}</h1>
      <p>{{ auction.description }}<p>
      <br>
      <table>
        <tr>
          <td style="text-align: center; font-weight: bold;" >Start Date</td>
          <td style="text-align: center; font-weight: bold;">End Date</td>
        </tr>
        <tr>
          <td>{{ new Date(auction.startDateTime).toString() }}</td>
          <td>{{ new Date(auction.endDateTime).toString() }}</td>
        </tr>
      </table>
      <br>
      <div id="bidHistory">
        <p>
          <button class="btn btn-lg btn-primary" v-on:click="seen = !seen">Bid History</button>
          <button class="btn btn-lg btn-primary" @click="goAuctions">Back to Listings</button>
        </p>
        <div id="bidInput" v-if="this.$cookie.get('authToken')" class="form-control">
          <!--Check for bids-->
          <div v-if="successfulBid == false" class="alert alert-warning">
            <strong>Invalid bid!</strong>
          </div>
          <br>
          <h3>Place Bid!</h3>
          <div class="input-group" style="width: 20%; margin-left: auto; margin-right: auto;">
            <b-form-input
              id="bidAmount"
              type="number"
              v-model="amount"
              placeholder="$">
            </b-form-input>
            <b-button v-on:click.prevent="placeBid()">Confirm</b-button>
          </div>
          <br>
        </div>
        <div v-if="seen">
          <div class="container">
            <b-table :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :fields="fields"
                     striped hover :items="auction.bids">

              <template slot="datetime" slot-scope="row" style="width: 100px">
                {{new Date(row.item.datetime).toLocaleTimeString()}}
                {{new Date(row.item.datetime).toDateString()}}
              </template>

            </b-table>
          </div>
        </div>
      </div>
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

        fields: [
          {key: 'buyerUsername', label: 'Buyer'},
          {key: 'amount', label: 'Amount $'},
          {key: 'datetime', label: 'Date and time'},
          {key: 'buyerId', label: 'Buyer ID'}
        ]
      }
    },
    mounted: function () {
      this.getAuctionDetails();
    },

    methods: {
      getImageUrl: function () {
        return "http://localhost:4941/api/v1/auctions/" + this.$route.params.auctionId + "/photos";
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

      placeBid: function () {
        this.$http.post('http://127.0.0.1:4941/api/v1/auctions/' + this.$route.params.auctionId + '/bids?amount=' + this.amount, {}, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            console.log(response);
            location.reload();

          }, function (error) {
            this.successfulBid = false;
            this.error = error;
            // this.errorFlag = true;
          });
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
        this.$http.patch('http://127.0.0.1:4941/api/v1/auctions/' + this.$route.params.auctionId,  JSON.stringify({
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
            // console.log(response.body)
            this.$http.post(
              'http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos',
              this.selectedFile,
              {
                headers: {
                  "X-Authorization": this.$cookie.get('authToken'),
                  "Content-Type": this.selectedFile.type
                }
              }).then(response => {
              location.reload();
              // this.$router.push('/auctions/' + response.data.id)
              // location.reload();
            }, response => {
              console.log("error")
            });
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

      onFileChanged(event) {
        this.selectedFile = event.target.files[0]
      },

      onUpload() {
        // upload file, get it from this.selectedFile
        this.$http.post(
          'http://localhost:4941/api/v1/auctions/' + this.$route.params.auctionId + '/photos',
          this.selectedFile,
          {
            headers: {
              "X-Authorization": this.$cookie.get('authToken'),
              "Content-Type": this.selectedFile.type
            }
          }).then(response => {
          // get body data
          console.log("success")
          console.log(this.$route.params.auctionId)
        }, response => {
          // error callback
          console.log("error")
        });
      },

      deletePhoto: function () {
        this.$http.delete('http://127.0.0.1:4941/api/v1/auctions/' + this.$route.params.auctionId + "/photos", {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            location.reload()
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
    }
  }
</script>

<style scoped>
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
    background-color: #4CAF50 !important;
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

  .container {
    background: none;
    display: inline-block;
  }
</style>
