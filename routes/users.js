const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Access: public
 * work: get all user information
 * Parameter:None
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by their id
 * Access: Public
 * Parameters: Id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      sucess: false,
      message: "User does not Exist!",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "User Found!",
      data: users,
    });
  }
});

/**
 * Route : /users
 * Method: POST
 * Description: Create New user
 * Access: Public
 * Parameters: none
 */ router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);
  if (user) {
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });
  }
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });

  return res.status(201).json({
    success: true,
    message: "User Added sucessfully",
    data: users,
  });
});
/**
 * Route : /users/:id
 * Method: PUT
 * Description: Updating user by id
 * Access: Public
 * Parameters: id
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not Exist",
    });
  }
  const updateUserData = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  return res.status(200).json({
    success: true,
    message: "User Data Updated !!",
    data: updateUserData,
  });
});

/**
 * Route : /users/:id
 * Method: DELETE
 * Description: Delete user by id
 * Access: Public
 * Parameters: id
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Does not Exist",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "User Deleted Sucessfully",
    data: users,
  });
});

/**
 * Route : /users/subscription-details/:id
 * Method: GET
 * Description: Get user subscriptio details
 * Access: Public
 * Parameters: id
 */

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User With The ID Didnt Exist",
    });
  }

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType == "Basic") {
      date = date + 90;
    } else if (user.subscriptionType == "Standard") {
      date = date + 180;
    } else if (user.subscriptionType == "Premium") {
      date = date + 365;
    }
    return date;
  };

  //Jan 1 1970 UTC
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays("");
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  console.log("returnDate ", returnDate);
  console.log("currentDate ", currentDate);
  console.log("subscriptionDate ", subscriptionDate);
  console.log("subscriptionExpiration ", subscriptionExpiration);
  const data = {
    ...user,
    isSubscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 100
          : 50
        : 0,
  };
  return res.status(200).json({
    success: true,
    message: "Subscription detail for the user is: ",
    data,
  });
});

module.exports = router;
