import axios from 'axios';

 makeApiCall = () => {
    return new Promise((resolve,reject)=>{
        axios.get('https://f143-backend.herokuapp.com/get_all_items')
        .then((response)=>{
            resolve(response)
        })
        .catch( (error) => {
            console.log(error);
            reject(error)
        });
    })
  };

  
export const setAllItem = (data) => (
    {
      type: 'SET_ALL_ITEM',
      payload:  makeApiCall,
    }
  );