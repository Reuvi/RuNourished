const axios = require("axios");
const { request } = require("express");


const get_ingredient_image = async (image, jwt) => {
    response = {
        status: false,
        message: "AI Response Failed",
        data: ""
    }

    const request = {image};


    //Application of discrete 1 , demorgans law :)
    try {
        const data = await axios.post("http://127.0.0.1:5004/detect-ingredients", request);
        
        response.message = "AI Success";
        response.data = data.data;
        response.success = true;

        return response
    }catch (err) {
        console.log(err);
        response.message = "Internal Error"
        return response;
    }
}

module.exports = { get_ingredient_image };