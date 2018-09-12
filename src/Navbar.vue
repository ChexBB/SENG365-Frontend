<template id="navbar">

  <b-navbar toggleable="md" type="dark" variant="success" >

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand @click="goHome"><img src="./assets/logo.png" width="40"></b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item @click="goHome">OKTrading</b-nav-item>
      <b-nav-item @click="goAuctions">Auctions</b-nav-item>
    </b-navbar-nav>

    <b-collapse is-nav id="nav_collapse">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <div v-if="this.errorFlag" class="alert alert-warning">
          <strong>Incorrect credentials!</strong>
          <p class="mb-0">
            Forms inputs are invalid!
          </p>
        </div>

        <div id="logid" v-if="!this.$cookie.get('authToken')">
          <router-link :to="{ name: '' }">
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#loginModal">Login
            </button>
          </router-link>
          <router-link :to="{ name: '' }">
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#signupModal">Sign up
            </button>
          </router-link>
        </div>

        <div id="loggedIn" v-if="this.$cookie.get('authToken')">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <!--<em> {{this.username}} </em>-->
              <em> Account </em>
            </template>
            <router-link :to="{ name: 'user', params: { userId: this.$cookie.get('authId')} }">
              <b-dropdown-item-button type="button" class="btn btn-edit">My Profile</b-dropdown-item-button>
            </router-link>
            <router-link :to="{ name: 'sellerAuctions', params: { sellerId: this.$cookie.get('authId')} }">
              <b-dropdown-item-button type="button" class="btn btn-edit">My Auctions</b-dropdown-item-button>
            </router-link>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout">
              Log out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </div>

        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="loginModalLabel">Log in</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <input v-model="username" placeholder="Enter your username"/>
                    <br>
                    <input v-model="email" type="email" placeholder="Or your email"/>
                    <br>
                    <input v-model="password" type="password" placeholder="Enter your password"/>
                    <br><br>
                    <button
                      class="btn btn-primary solid blank"
                      data-dismiss="modal"
                      v-on:click.prevent="login()"
                    >
                      Login <i class="fa fa-arrow-circle-o-right"></i>
                    </button>
                    <br><br>
                    Don’t have an account? &nbsp;
                    <router-link :to="{ name: '' }">
                      <button type="button" class="btn btn-secondary"
                              data-dismiss="modal" data-toggle="modal" data-target="#signupModal">Sign up
                      </button>
                    </router-link>
                  </form>
                </div>
              </div>
            </div>
        </div>

        <div class="modal fade" id="signupModal" tabindex="-1" role="dialog" aria-labelledby="signupModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="signupModalLabel">Sign up</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <input v-model="firstName" placeholder="First Name"/>
                  <br>
                  <input v-model="lastName" placeholder="Last Name"/>
                  <br>
                  <input v-model="username" placeholder="Username"/>
                  <br>
                  <input v-model="password" type="password" placeholder="Password"/>
                  <br>
                  <input v-model="email" type="email" placeholder="Email"/>
                  <br><br>
                  <button
                    data-id="create.submit"
                    class="btn btn-primary solid blank"
                    data-dismiss="modal"
                    v-on:click.prevent="createUser()">
                    Sign up
                  </button>
                </form>
                <br>
                Already have an account? &nbsp;
                <router-link :to="{ name: '' }">
                  <button type="button" class="btn btn-secondary"
                          data-dismiss="modal" data-toggle="modal" data-target="#loginModal">Log in
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="logoutModalLabel"
             aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="logoutModalLabel">Account</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <button
                    @click="goHome"
                    class="btn btn-primary solid blank"
                    v-on:click="logout()"
                  >
                    Log out <i class="fa fa-arrow-circle-o-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
  <!-- navbar-1.vue -->

</template>

<script>
  import * as router from "vue";

  export default {
    name: "navbar",

    data() {
      return {
        error: "",
        errorFlag: "",

        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",

        id: "",
        token: "",

        userId: "",
        userToken: "",
      }
    },

    methods: {
      login: function () {
        let loginData = {
          username: this.username,
          email: this.email,
          password: this.password
        };

        this.$http.post('http://127.0.0.1:4941/api/v1/users/login', loginData, {})
          .then(function (response) {
            this.$cookie.set("authId", response.body.id)
            this.$cookie.set("authToken", response.body.token)
            location.reload();

            // this.$store.commit('changeId', response.data.id);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      createUser: function () {
        this.$http.post('http://127.0.0.1:4941/api/v1/users', JSON.stringify({
          "username": this.username,
          "givenName": this.firstName,
          "familyName": this.lastName,
          "email": this.email,
          "password": this.password
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(function (response) {
            this.login();
            this.goHome();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      logout: function () {
        this.$http.post('http://127.0.0.1:4941/api/v1/users/logout', {}, {
          headers: {
            'X-Authorization': this.$cookie.get('authToken')
          }
        })
          .then(function (response) {
            this.$cookie.delete("authId")
            this.$cookie.delete("authToken")
            location.reload();

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
        this.goHome();
      },

      //this might be a temporary fix until the refresh log out issue is solved
      goHome: function () {
        this.$router.push({name: 'home'});
      },

      goAuctions: function () {
        this.$router.push({name: 'auctions'});
      }
    }
  }
</script>

<style>
  #logid button {
    float: right;
    color: black;
  }

  nav-form {
    margin-left: auto;
    margin-right: auto;
  }

</style>
