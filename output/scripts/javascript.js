"use strict";

var React = require('react');
var _ReactRouter = ReactRouter;
var Router = _ReactRouter.Router;
var Route = _ReactRouter.Route;
var IndexRoute = _ReactRouter.IndexRoute;
var Redirect = _ReactRouter.Redirect;
var Link = _ReactRouter.Link;
var IndexLink = _ReactRouter.IndexLink;
var Navigation = _ReactRouter.Navigation;

$(document).ready(function () {
  $('.navbar__toggle').on('click', function (e) {
    e.preventDefault();
    $('.navbar').toggleClass('open');
  });
});
/**
 * /
 * /search
 * /search?rand
 * /w/:page_title
 */
var Article = React.createClass({
  displayName: 'Article',

  componentWillMount: function componentWillMount() {
    var title = this.props.params.title.split('+').join(' ');
    this.setState({ title: title });
  },
  render: function render() {
    return React.createElement(
      'h2',
      null,
      'This is an article with title ',
      this.state.title
    );
  }
});

var Search = React.createClass({
  displayName: 'Search',

  render: function render() {
    return React.createElement(
      'h2',
      null,
      'This is the search'
    );
  }
});

var TypeAheadList = React.createClass({
  displayName: 'TypeAheadList',

  mixins: [Navigation],
  handleClick: function handleClick(pageid) {
    this.props.onSubmit(pageid);
  },
  render: function render() {
    var suggestions = [];
    if (this.props.data.error !== undefined) {
      suggestions.push(React.createElement(
        'li',
        null,
        this.props.data.error
      ));
    } else {
      for (var prop in this.props.data) {
        suggestions.push(React.createElement(
          'li',
          { key: this.props.data[prop].pageid, onClick: this.handleClick.bind(null, this.props.data[prop].pageid) },
          this.props.data[prop].title
        ));
      }
    }
    return React.createElement(
      'ul',
      { className: 'typeahead__list' },
      suggestions
    );
  }
});
var SearchForm = React.createClass({
  displayName: 'SearchForm',

  contextTypes: {
    router: React.PropTypes.func
  },
  handleSearchSubmit: function handleSearchSubmit(searchTerm) {
    this.context.router.transitionTo("search", { searchTerm: searchTerm });
  },
  getInitialState: function getInitialState() {
    return { typeAhead: {} };
  },
  fetchTypeAhead: function fetchTypeAhead(value) {
    var _this = this;

    var url = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=5&prop=info|extracts&exintro&exsentences=3&exlimit=max&explaintext&gsrsearch=';
    url = url + value;
    $.ajax({
      dataType: 'jsonp',
      url: url,
      crossDomain: true,
      success: function success(data) {
        if (data.query !== undefined) {
          var pages = data.query.pages;
          _this.setState({ typeAhead: data.query.pages });
        } else {
          _this.setState({ typeAhead: {
              error: 'No Suggestions'
            } });
        }
      },
      error: function error(xhr, status, err) {
        console.log(status, err.toString());
      }
    });
  },
  handleInput: function handleInput(e) {
    var value = e.target.value;
    if (value.length >= 3) {
      this.fetchTypeAhead(e.target.value);
    } else {
      this.setState({ typeAhead: {} });
    }
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'navbar__search-form', onChange: this.handleInput },
      React.createElement(
        'div',
        { className: 'typeahead' },
        React.createElement('input', { type: 'text', placeholder: 'Search Wikipedia' }),
        React.createElement(
          'div',
          { className: 'typeahead__container' },
          React.createElement(TypeAheadList, { data: this.state.typeAhead, onSubmit: this.handleSearchSubmit })
        )
      ),
      React.createElement(
        'button',
        { className: 'navbar__search-form-clear', value: 'clear', id: 'clear-form' },
        React.createElement('i', { className: 'ion-ios-close' }),
        ' ',
        React.createElement(
          'span',
          { className: 'navbar__search-form--hide' },
          'Clear'
        )
      ),
      React.createElement(
        'button',
        { className: 'navbar__search-form-submit', value: 'submit' },
        React.createElement('i', { className: 'ion-ios-search' }),
        ' ',
        React.createElement(
          'span',
          { className: 'navbar__search-form--hide' },
          'Search'
        )
      )
    );
  }
});
// Scripts here
var App = React.createClass({
  displayName: 'App',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: 'header navbar' },
        React.createElement(
          'div',
          { className: 'navbar__wrapper' },
          React.createElement(
            Link,
            { to: '/', className: 'navbar__brand' },
            React.createElement(
              'div',
              { className: 'navbar__brand--logo' },
              React.createElement(
                'svg',
                { width: '100%', height: '100%', viewBox: '0 0 50 34', id: 'fcc-logo' },
                React.createElement(
                  'g',
                  { id: 'Group' },
                  React.createElement('path', { className: 'fcc-logo-path', id: 'path29', d: 'M0.234,16.353c0,-5.163 1.786,-9.783 5.385,-13.886c1.299,-1.467 2.381,-2.228 3.112,-2.228c0.244,0 0.487,0.081 0.731,0.244c0.162,0.163 0.324,0.408 0.324,0.652c0,0.408 -0.487,0.979 -1.38,1.903c-3.761,3.614 -5.655,8.043 -5.655,13.397c0,5.923 1.975,10.679 5.817,14.375c0.812,0.734 1.137,1.304 1.137,1.794c0,0.244 -0.162,0.489 -0.325,0.733c-0.162,0.163 -0.487,0.326 -0.73,0.326c-0.893,0 -2.138,-1.059 -3.761,-3.125c-3.166,-3.913 -4.655,-8.587 -4.655,-14.185l0,0Z' }),
                  React.createElement('path', { id: 'path31', d: 'M49.805,17.658c0,5.163 -1.786,9.782 -5.385,13.886c-1.299,1.467 -2.381,2.228 -3.111,2.228c-0.244,0 -0.487,-0.082 -0.731,-0.245c-0.163,-0.163 -0.325,-0.489 -0.325,-0.733c0,-0.408 0.487,-0.979 1.38,-1.794c3.761,-3.614 5.655,-8.043 5.655,-13.397c0,-5.924 -1.975,-10.68 -5.817,-14.375c-0.812,-0.734 -1.137,-1.305 -1.137,-1.794c0,-0.244 0.163,-0.489 0.325,-0.733c0.163,-0.163 0.487,-0.327 0.73,-0.327c0.812,0 2.138,1.06 3.762,3.126c3.003,3.913 4.654,8.587 4.654,14.158Z',
                    className: 'fcc-logo-path' }),
                  React.createElement('path', { id: 'path37', d: 'M36.379,32.64l-22.683,0c-0.812,0 -1.422,-0.612 -1.422,-1.428c0,-0.816 0.61,-1.428 1.422,-1.428l22.683,0c0.812,0 1.422,0.612 1.422,1.428c-0.204,0.816 -0.61,1.428 -1.422,1.428Z', className: 'fcc-logo-path' }),
                  React.createElement('path', { id: 'Shape', d: 'M20.204,3.038c0,0 1.893,1.304 1.893,3.695c0,4.104 -5.574,8.615 -5.574,12.881c0,4.592 3.518,7.554 6.873,8.451c0.487,0.082 0.65,-0.408 0.081,-0.57c-1.38,-0.327 -2.868,-2.147 -2.868,-4.919c0,-2.636 2.543,-3.614 3.518,-4.837c1.055,-1.304 0.811,-2.962 0.162,-3.451c-0.65,-0.49 -0.162,-1.141 0.893,-0.326c1.056,0.734 1.975,2.228 1.623,3.532c-0.406,1.713 0.163,2.718 1.055,2.881c0.894,0.163 1.895,-0.326 1.787,-1.141c-0.109,-0.816 -0.569,-1.712 -0.325,-1.712c0.649,0 1.975,1.548 1.975,4.103c0,2.554 -2.056,4.266 -2.706,4.919c-0.405,0.407 0.082,0.896 0.65,0.652c0.243,-0.082 0.811,-0.408 1.136,-0.652c1.624,-1.142 4.167,-3.533 4.167,-7.881c0,-4.593 -1.705,-6.658 -3.518,-8.37c-1.785,-1.712 -2.218,-1.304 -1.704,-0.407c1.461,2.554 0.568,3.451 -0.487,3.451c-1.299,0 -1.299,-2.881 -1.894,-5.082c-1.055,-4.918 -5.574,-5.761 -6.386,-5.843c-0.595,-0.271 -1.353,0.218 -0.351,0.626Z',
                    className: 'fcc-logo-path' })
                )
              )
            ),
            React.createElement(
              'span',
              { className: 'navbar__brand--title' },
              'Wiki Search'
            )
          ),
          React.createElement(
            'div',
            { className: 'hamburger navbar__toggle' },
            React.createElement(
              'button',
              { className: 'hamburger__button' },
              React.createElement('span', { className: 'hamburger__inner' })
            )
          ),
          React.createElement(
            'div',
            { className: 'navbar__collapse' },
            React.createElement(
              'div',
              { className: 'navbar__module navbar__module--left' },
              React.createElement(
                'nav',
                null,
                React.createElement(
                  'ul',
                  null,
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      Link,
                      { to: '/random', className: 'navbar__link' },
                      React.createElement('i', { className: 'ion-shuffle' }),
                      ' Random'
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'navbar__module navbar__module--right' },
              React.createElement(SearchForm, null)
            )
          )
        )
      ),
      React.createElement(
        'section',
        { className: 'page' },
        React.createElement(
          'div',
          { className: 'page__content-wrapper' },
          this.props.children
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(
  Router,
  null,
  React.createElement(
    Route,
    { name: 'index', path: '/', component: App },
    React.createElement(Route, { name: 'random', path: '/random', component: Search }),
    React.createElement(Route, { name: 'search', path: '/search/:searchTerm', component: Search }),
    React.createElement(Route, { name: 'article', path: '/article/:title', component: Article })
  )
), document.getElementById('app'));