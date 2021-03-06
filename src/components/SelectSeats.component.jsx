import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import swal from "@sweetalert/with-react";
import axios from "axios";
import { Success_payment } from "../function/Success_payment";
import PulseLoader from "react-spinners/PulseLoader";

import MobileScreen from "../asset/Line 2.svg";
import PcScreen from "../asset/Path 17.svg";
import "./styles/SelectSeats.styles.css";
import "./styles/timeline.css";
class SeatsComp extends Component {
  constructor() {
    super();
    this.state = {
      selectedMovie: [],
      theaterDetails: [],
      toggle: false,
      seats: [["wx"], ["xw"]],
      selectedSeats: ["xyz"],
      amount: 0,
      path: { distance: 0, path: [] },
    };
    this.recordIds = this.recordIds.bind(this);
    this.launchRazorPay = this.launchRazorPay.bind(this);
  }
  componentDidMount() {
    this.setState({
      selectedMovie: JSON.parse(localStorage.selectedMovie),
      theaterDetails: JSON.parse(localStorage.theaterDetails),
    });
    let theaterList = JSON.parse(localStorage.theaters);
    // this.props.userRedux.user.fullname,
    //     theaterList.theaters,
    //     JSON.parse(localStorage.theaterDetails).name
    axios
      .post("/path", {
        data: {
          user: this.props.userRedux.user.fullname,
          theaters: theaterList.theaters,
          destination: JSON.parse(localStorage.theaterDetails).name,
        },
      })
      .then((data) => this.setState({ path: data.data }))
      .catch((err) => alert(err));
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      console.log(nextProps);
      this.setState({
        seats: nextProps.seats,
      });
    }
  }
  recordIds(e) {
    let oldData = this.state.selectedSeats;
    let price = Number(
      oldData.length * this.state.theaterDetails.price + 60 * oldData.length
    );
    if (oldData.includes(e.target.id)) {
      let res = oldData.filter((data) => data !== e.target.id);
      this.setState({
        selectedSeats: res,
        amount:
          this.state.amount - (Number(this.state.theaterDetails.price) + 60),
      });
      return;
    }
    if (this.state.selectedSeats.length - 1 === 6) {
      return swal(
        <div>
          <center>
            <img
              src="https://i.ibb.co/s5dHx0f/fogg-page-under-construction-1.png"
              alt="error"
              className="w-9/12 lg:w-11/12"
            />
            <h2 className="mt-5 text-headingColor text-lg font-bold lg:text-2xl">
              Seat limit reached!
            </h2>
            <h4 className="text-gray-700 text-xs font-semibold lg:text-sm">
              You can only select 6 seats at a time...
            </h4>
          </center>
        </div>
      );
    }

    this.setState({
      selectedSeats: [...this.state.selectedSeats, `${e.target.id}`],
      amount: price,
    });
  }
  launchRazorPay() {
    if (this.state.amount === 0) {
      return alert("Please select atleast one seat to proceed");
    }
    let data = {
      email: this.props.user.email,
      seats: this.state.selectedSeats,
      theater_name: this.state.theaterDetails.name,
      theater_address: this.state.theaterDetails.location,
      movie_name: this.state.selectedMovie.title,
      poster: this.state.selectedMovie.poster_path,
      time: this.state.theaterDetails.time,
      price: this.state.theaterDetails.price,
      quantity: this.state.selectedSeats.length - 1,
      type: this.state.theaterDetails.type,
      date: `${this.state.theaterDetails.date} ${this.state.theaterDetails.month}`,
    };
    let options = {
      key: "rzp_test_htvyMlKD2w7cGB",
      amount: `${this.state.amount * 100}`,
      currency: "INR",
      name: "Movies Go",
      description: "Cinema Seat Reservation",
      image: "https://i.ibb.co/GH9nk13/typographical.png",
      handler: function (response) {
        Success_payment(data);
        swal(
          <div>
            <center>
              <img
                src="https://i.ibb.co/TWqBp2P/pluto-welcome.png"
                alt="success"
                className="w-9/12"
              />
              <h2 className="mt-5 text-headingColor text-lg font-bold">
                Yay!. Your seat has been reserved.
              </h2>
              <h4 className="text-gray-700 text-xs font-semibold ">
                You can find your ticket in ticket cart{" "}
                <i className="fas fa-shopping-basket fa-lg mr-8 text-logoColor"></i>
              </h4>
            </center>
          </div>
        );
      },
      prefill: {
        name: this.props.user.fullname,
        email: this.props.user.email,
      },

      theme: {
        color: "#5a67d8",
      },
    };
    let rzp = new window.Razorpay(options);
    rzp.open();
  }
  render() {
    return (
      <div>
        {/* image */}
        <div>
          <img
            src={`http://image.tmdb.org/t/p/original/${this.state.selectedMovie.backdrop_path}`}
            alt="backdrop_path"
            className="posterImage"
          />
        </div>
        {/* theater info */}
        <div className="mx-4 mt-5">
          <h3 className="text-xl font-bold text-headingColor lg:text-2xl">
            {this.state.theaterDetails.name}
          </h3>
          <h3 className="text-xs font-light w-10/12 truncate text-gray-600 lg:text-sm lg:text-headingColor">
            {this.state.theaterDetails.location}
          </h3>
          <span className="uppercase text-sm text-gray-600">
            {this.state.theaterDetails.date} {this.state.theaterDetails.month} |{" "}
            {this.state.theaterDetails.time} | {this.state.theaterDetails.type}{" "}
          </span>
        </div>
        {/*  shortest path*/}
        <div className={"mt-3 shadow-xl py-8 mx-4 neupormism"}>
          <h2 className={"ml-4 text-base text-logoColor font-semibold"}>
            Shortest path to reach{" "}
            <span className={"font-bold"}>
              {this.state.theaterDetails.name}
            </span>
          </h2>
          <h2 className={"ml-4 text-base text-headingColor font-semibold"}>
            Total distance :{" "}
            <span
              className={
                "bg-teal-500 text-white px-2 text-sm rounded-extendedcorner lg:text-base"
              }
            >
              {this.state.path.distance} km
            </span>
          </h2>
          <div className="mt-8">
            <center>
              <ul className={"leaders "}>
                <li className={"inline ml-3"}>
                  <i className="fa fa-user fa-lg text-logoColor"></i>
                  <span
                    className={
                      "ml-2 text-xs text-headingColor font-semibold uppercase tracking-wider w-2/5 truncate lg:text-base"
                    }
                  >
                    {this.props.userRedux.user.fullname}{" "}
                    <PulseLoader
                      size={6}
                      margin={2}
                      color={"#5a67d8"}
                      loading={this.state.path.path.length === 0}
                    />
                  </span>
                </li>
                {this.state.path.path.map((data) => (
                  <>
                    <li className={"inline ml-1 text-gray-500"}> ----- </li>
                    <li className={"inline "}>
                      <span
                        className={
                          "ml-1 text-xs text-headingColor font-semibold uppercase tracking-wider w-2/5 truncate lg:text-base"
                        }
                      >
                        {data}
                      </span>
                    </li>
                  </>
                ))}
              </ul>
            </center>
          </div>
        </div>
        {/* Ticket legends */}
        <div className="mt-24 flex justify-around items-center lg:24">
          {/* selected */}
          <div className="text-logoColor flex justify-center items-center lg:text-2xl">
            <i className="fas fa-square fa-lg"></i>
            <h4 className="ml-2 text-gray-800 text-xs font-semibold uppercase tracking-widest lg:text-lg">
              Selected
            </h4>
          </div>
          {/* available */}
          <div className="text-logoColor flex justify-center items-center lg:text-2xl">
            <i className="far fa-square fa-lg"></i>
            <h4 className="ml-2 text-gray-800 text-xs font-semibold uppercase tracking-widest lg:text-lg">
              available
            </h4>
          </div>
          {/* sold out */}
          <div className="text-gray-400 flex justify-center items-center lg:text-2xl">
            <i className="fas fa-square fa-lg"></i>
            <h4 className="ml-2 text-gray-800 text-xs font-semibold uppercase tracking-widest lg:text-lg">
              sold out
            </h4>
          </div>
        </div>
        {/* screen */}
        <div className="mt-8 md:hidden lg:hidden xl:hidden">
          <center>
            <img className="h-12" src={MobileScreen} alt="screen" />
          </center>
        </div>
        {/* PC screen */}
        <div className="mt-16 sm: hidden md:block lg:block xl:block">
          <center>
            <img className="h-12" src={PcScreen} alt="screen" />
          </center>
        </div>
        {/* seats */}
        <div className="flex justify-center flex-wrap mx-4 lg:mt-6 lg:mx-64 seats">
          {this.state.seats[0].map((seat) => (
            <input
              {...seat}
              key={Math.random()}
              onChange={this.recordIds}
              checked={
                this.state.selectedSeats.includes(seat.id) ? true : false
              }
            />
          ))}
          {this.state.seats[1].map((seat) => (
            <input
              {...seat}
              key={Math.random()}
              onChange={this.recordIds}
              checked={
                this.state.selectedSeats.includes(seat.id) ? true : false
              }
            />
          ))}
        </div>
        {/* caution */}
        <div className="mx-3 mt-12 lg:mx-8">
          <h3 className="text-red-500 text-xs tracking-wider lg:text-sm">
            {" "}
            <span className="font-bold">
              If otp is asked, please click skip saved cards
            </span>
          </h3>
          <div className="flex justify-around items-center text-xs text-headingColor lg:justify-start lg:text-sm">
            
           
          </div>
        </div>
        {/* summary */}
        <div className="mt-12 lg:flex lg:justify-around mt-12 lg:items-center bg-logoColor py-4 text-white mx-4 rounded-extendedcorner shadow-lg lg:mx-6 lg:py-8">
          <div className="w-9/12 ml-4  lg:w-4/12 lg:mt-0">
            <h1 className="text-xl font-semibold lg:text-2xl text-white">
              Order Summary
            </h1>
            <div className="mt-2 border-b-2 border-white">
              <div className="flex mx-auto items-baseline justify-between">
                <h3 className="   lg:text-xl text-white">Ticket Price</h3>
                <h4 className=" text-xs  lg:text-sm text-white">
                  {this.state.theaterDetails.price} x{" "}
                  {this.state.selectedSeats.length - 1}
                </h4>
                <h3 className="  lg:text-xl text-white">
                  {this.state.theaterDetails.price *
                    (this.state.selectedSeats.length - 1)}
                </h3>
              </div>
              <div className="flex mx-auto items-baseline  justify-between">
                <h3 className=" lg:text-xl text-white">Service Fee</h3>
                <h4 className=" text-xs   lg:text-sm text-white">
                  60 x {this.state.selectedSeats.length - 1}
                </h4>
                <h3 className=" lg:text-xl text-white">
                  {60 * (this.state.selectedSeats.length - 1)}
                </h3>
              </div>
            </div>
            <div className="flex mx-auto justify-between items-baseline lg:text-xl  text-white">
              <h3 className=" font-semibold">Grand Total</h3>
              <h3 className=" font-semibold lg:text-xl">
                {this.state.theaterDetails.price *
                  (this.state.selectedSeats.length - 1) +
                  60 * (this.state.selectedSeats.length - 1)}
              </h3>
            </div>
          </div>
          {/* checkout button */}
          <div className="content-center mx-4 mt-4 lg:w-4/12 lg:mt-0">
            <button
              type="button"
              className="w-full uppercase text-xs tracking-wider text-white font-semibold rounded-sm py-2 shadow-lg lg:w-8/12 lg:py-5 lg:text-sm text-logoColor bg-white"
              onClick={this.launchRazorPay}
            >
              Pay Securely <i className="fas fa-lock"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userRedux: state.auth,
});

export default connect(mapStateToProps, null)(withRouter(SeatsComp));
