import Login from "views/ViewPublic/Login/index.js";
import Register from "views/ViewPublic/Register/index.js";


var routesPublic =[
    {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-bank",
    component: <Login />,
    layout: "/public",
  },
  {
    path: "/register",
    name: "Register",
    icon: "nc-icon nc-bank",
    component: <Register />,
    layout: "/public",
  },
  {


  },
];



export default routesPublic;
