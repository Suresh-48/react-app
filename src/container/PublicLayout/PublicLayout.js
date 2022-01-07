import React, { Component, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

// routes config
import routes from "../../routes";
import HeaderNavbar from "../../components/core/HeaderNavbar";

const PublicFooter = React.lazy(() => import("./PublicFooter"));

class DefaultLayout extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    let showNav = "";

    return (
      <div className="app">
        <div className="app-body" style={{ minHeight: "calc(100vh - 123px)" }}>
          <div className="pt-3">
            <HeaderNavbar />

            <div className="container site-maincontent" >
              <Suspense>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => <route.component {...props} />}
                      />
                    ) : (
                      ""
                    );
                  })}
                </Switch>
              </Suspense>
            </div>
          </div>
        </div>

        <footer className={`footer footer-content ${showNav}`}>
          <Suspense fallback={this.loading()}>
            <PublicFooter />
          </Suspense>
        </footer>
      </div>
    );
  }
}

export default DefaultLayout;
