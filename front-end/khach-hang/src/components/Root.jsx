// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

// application
import messages from '../i18n';

// pages
import Layout from './Layout';
import TrangChu from './home/TrangChu';
import { LoadingProvider } from '../context/LoadingContext';
import { NofiticationProvider } from '../context/NotificationContext';


class Root extends Component {

  render() {
    const { locale } = this.props;

    return (
      <LoadingProvider>
        <NofiticationProvider>
          <IntlProvider locale={locale} messages={messages[locale]}>
            <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
              <Switch>
                <Route
                  path="/"
                  render={(props) => (
                    <Layout {...props} headerLayout="default" homeComponent={TrangChu} />
                  )}
                />
                <Redirect to="/" />
              </Switch>
            </BrowserRouter>
          </IntlProvider>
        </NofiticationProvider>
      </LoadingProvider>
    );
  }
}

Root.propTypes = {
  /** current locale */
  locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
  locale: state.locale,
});

export default connect(mapStateToProps)(Root);
