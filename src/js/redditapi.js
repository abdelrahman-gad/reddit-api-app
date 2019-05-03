export default {
    /**
     * @description this object dealing with the reddit api usin fetch api
     * @see {@link http://www.reddit.com }
     * @this reddit  object
     * @name search 
     * @param  {string}  searchTerm   represents the word term user is looking for 
     * @param  {number} searchLimit   the number of search result reflect back from the api
     * @param {string}   sortBy       the priority of sorting by latest posts or revelancy
     * @method 
     * @returns {Array<Object>}       each object contains bunch of properties  {title , name ,image}   like so 
     */
    search: function(searchTerm, searchLimit, sortBy) {
      return fetch(
        `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
      )
        .then(res => res.json())
        .then(data => {
          return data.data.children.map(data => data.data);
        })
        .catch(err => console.log(err));
    }
  };