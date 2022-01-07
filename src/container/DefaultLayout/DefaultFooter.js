import React, { Component } from "react";

// Helper
import { getCurrentYear } from "../../utils/helper";

class DefaultFooter extends Component {
  render() {
    return (
      <div className="footer-content">
        <div className="text-center">
          <span>
            &copy; {getCurrentYear()} Aviar Technology services. All rights
            reserved.
          </span>
        </div>
      </div>
    );
  }
}

export default DefaultFooter;
