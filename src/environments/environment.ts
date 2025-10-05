export const environment = {
    production: false,
    // baseUrl: 'http://localhost:5000/api/',
    // reportUrl: 'http://localhost:49530/',
    // socketUrl: 'http://localhost:4000',
    // nodeUrl: 'http://localhost:4000/api/',
  
    
    //local signal R
    // signalRUrl: 'http://localhost/recipe_api_simulation/SignalR',

    
   baseUrl: 'http://' + window.location.hostname + ':114/recipe_api/api/',
   reportUrl: 'http://' + window.location.hostname + ':114/recipe_reports/',
 
  socketUrl: 'http://' + window.location.hostname + ':3500/',
  nodeUrl: 'http://' + window.location.hostname + ':3500/api/'
};
