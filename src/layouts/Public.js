import { Profiler, memo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routesPublic from "routesPublic.js";
const MasterLayout = ({children,...props}) => { 

    return (

        <div {...props}>
        <Routes>
          {routesPublic.map((prop, key) => {
            return (
              <Route
                path={prop.path}
                element={prop.component}
                key={key}
                exact
              />
            );
          })}
        </Routes>  
        </div>

    );
};
export default memo(MasterLayout);