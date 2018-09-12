<template>
  <div v-if="this.$cookie.get('authId') === this.$route.params.userId">
    <div id="user">
      <br/><br/>

      <h1>Hello, {{ user.givenName }} {{ user.familyName }}</h1>
      <br>
      <div class="container">
        <h3>First Name:</h3><p>{{ user.givenName }}</p>
      </div>

      <br>
      <div class="container">
        <h3>Last Name:</h3><p>{{ user.familyName }}</p>
      </div>

      <br>
      <div class="container">
        <h3>Username:</h3><p>{{ user.username }}</p>
      </div>

      <br>
      <div class="container">
        <h3>Email:</h3><p>{{ user.email }}</p>
      </div>

      <br>
      <div class="container">
        <h3>Account Balance:</h3><p>$ {{ user.accountBalance }}</p>
      </div>
    </div>

    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home
    </button>

    <router-link :to="{ name: 'sellerAuctions', params: { sellerId: this.$cookie.get('authId')} }">
      <button type="button" class="btn btn-edit">My Auctions</button>
    </router-link>

    <button type="button" class="btn btn-edit" data-toggle="modal" data-target="#editUserModal">Edit
    </button>

    <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              New: <input v-model="givenName" placeholder="Given name"/>
              <br>
              New: <input v-model="familyName" placeholder="Family name"/>
              <br>
            </form>
          </div>
          <div class="modal-footer">
            <input type="button" class="btn btn-edit" data-dismiss="modal" v-on:click="editUser()" value="Confirm"/>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <div id="otherUser">
      <br>
      <h2>User Profile: {{ user.username }}</h2>
      <br/><br/>
      <div class="container">
        <h3>First Name:</h3><p>{{ user.givenName }}</p>
      </div>

      <br/><br/>
      <div class="container">
        <h3>Last Name:</h3><p>{{ user.familyName }}</p>
      </div>

      <br/><br/>
      <div class="container">
        <h3>Username:</h3><p>{{ user.username }}</p>
      </div>
    </div>
    <br><br>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home
    </button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'auctions'})">Auctions
    </button>
  </div>

</template>

<script>
  export default {
    name: "users",
    data() {
      return {
        error: "",
        errorFlag: false,

        givenName: "",
        familyName: "",

        user: []
      }
    },

    mounted: function () {
      this.getUserDetails();
    },
    methods: {
      getUserDetails: function () {
        this.$http.get("http://localhost:4941/api/v1/users/" + this.$route.params.userId, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      editUser: function () {
        console.log(this.givenName);
        console.log(this.familyName);
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$cookie.get('authId'), JSON.stringify({
          "givenName": this.givenName, "familyName": this.familyName
        }), {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (res) {
            location.reload();
            },
            function (err) {
              console.log(err);
            });
      }
    }


  }
</script>

<style scoped>
  .modal-footer {
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    display: inline-block;
  }
</style>
