const axios = require('axios').default;

let API_KEY = process.env.WEATHER_API_KEY;



module.exports = (app) => {

    app.get('/api/currentWeatherByName', (req, res) => {
        let cityName = req.query.cityName;
        if (!cityName) {
            res.status(400).send("Bad request")

            return
        }
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`).then(response => {
            res.json(response.data)
        }).catch(err => {

            res.status(err.response.status).send(err.response.statusText)
        })

    })

    app.get('/api/currentWeatherByLoc', (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        if (!long || !lat) {
            res.status(400).send("Bad request")

            return
        }
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`).then(response => {
            res.json(response.data)
        }).catch(err => {

            res.status(err.response.status).send(err.response.statusText)
        })
    })

    app.get('/api/getCountries/:country',(req,res)=>{
        if(!req.params.country){
            res.json([])
            return
        }
        axios.get('https://restcountries.com/v2/alpha/'+req.params.country).then(response=>{
            res.json(response.data)
        }).catch(err=>{
            res.json([])
        })
    })




    app.get('/api/oneCallWeatherByLoc', (req, res) => {


        let units = req.query.units || "metric"

        if (!["standard", "metric", "imperial"].includes(units)) {
            units = "metric"
        }
        let longParam = req.query.lon;
        let latParam = req.query.lat;
        if (!longParam || !latParam) {
            res.status(400).send("Bad request")
            return
        }

        axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lon=${longParam}&lat=${latParam}&limit=1&appid=${API_KEY}`).then(response => {



            let long = response.data[0].lon
            let lat = response.data[0].lat
            let id = response.data[0].country
            let locationName = response.data[0].name
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}&units=${units}`).then(response => {
                let data = response.data
                data["countryId"] = id
                data["locationName"] = locationName
                axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API_KEY}`).then(response => {

                    data["air_pollution"] = response.data
                    res.json(data)
                }).catch(err => {
                    res.json(data)
                })
            }).catch(err => {
                console.log(err);
                res.status(404).send("Not found")
            })
        }).catch(err => {
            console.log(err);
            res.status(404).send("Not found")
        })
    })

    app.get('/api/oneCallWeatherByName', (req, res) => {
        // if(test=="true"){
        //     console.log("TEST API MODE");
        //   let json=  fs.readFileSync(process.cwd()+"\\response.json",{encoding:'utf8'})
        //     res.json(JSON.parse(json))
        //     return

        // }


        let cityName = req.query.cityName;
        let units = req.query.units || "metric"
        // let dt = req.query.dt || getStartingDate()
        if (!["standard", "metric", "imperial"].includes(units)) {
            units = "metric"
        }
        if (!cityName) {
            res.status(400).send("Bad request")
            return
        }

        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`).then(response => {
            let long = response.data[0].lon
            let lat = response.data[0].lat
            let id = response.data[0].country
            let locationName = response.data[0].name
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}&units=${units}`).then(response => {
                let data = response.data
                data["countryId"] = id
                data["locationName"] = locationName
                axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API_KEY}`).then(response => {

                    data["air_pollution"] = response.data
                    res.json(data)
                }).catch(err => {
                    res.json(data)
                })
            }).catch(err => {
                console.log(err);
                res.status(404).send("Not found")
            })
        }).catch(err => {
            console.log(err);
            res.status(404).send("Not found")
        })
    })


    app.get('/api/getAirPollutionByLoc', (req, res) => {
        let long = req.query.long;
        let lat = req.query.lat;
        if (!long || !lat) {
            res.status(400).send("Bad request")

            return
        }
        axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API_KEY}`).then(response => {
            res.json(response.data)
        }).catch(err => {

            res.status(err.response.status).send(err.response.statusText)
        })
    })

    app.get('/api/getAirPolltionByName', (req, res) => {
        let cityName = req.query.cityName;

        if (!cityName) {
            res.status(400).send("Bad request")
            return
        }
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`).then(response => {
            let long = response.data[0].lon
            let lat = response.data[0].lat

            axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API_KEY}`).then(response => {
                res.json(response.data)
            }).catch(err => {

                res.status(err.response.status).send(err.response.statusText)
            })
        }).catch(err => {

            res.status(err.response.status).send(err.response.statusText)
        })
    })

    app.get('/api/getLocationByName', (req, res) => {
        let cityName = req.query.cityName;
        let full = req.query.full

        if (!cityName) {
            res.status(400).send("Bad request")
            return
        }
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`).then(response => {
            if (full) {
                res.json(response.data)
                return
            }
            let long = response.data[0].lon
            let lat = response.data[0].lat

            res.json({
                long,
                lat
            })
        }).catch(err => {

            res.status(err.response.status).send(err.response.statusText)
        })
    })






}