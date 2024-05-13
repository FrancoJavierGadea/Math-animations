

export function debounce(callback, time = 500){

    let timeoutID = null;

    return (...args) => {

        if(timeoutID) window.clearTimeout(timeoutID);
        
        timeoutID = window.setTimeout(() => {
             
            callback(...args);        
    
        }, time);
    }
}