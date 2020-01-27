import Controller from '@ember/controller';

export default Controller.extend({
    searchTerm: '',
 
    queryParams: {
        searchTerm: 's',
      },
});
