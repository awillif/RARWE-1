export default function() {
  this.get('/bands');
  this.get('/bands/:id');
  this.post('/bands');
 
  this.get('/songs')
  this.get('/songs/:id')
  this.post('/songs')

  this.get('bands/:id/songs', function(schema, request) {
    let id = request.params.id;
    return schema.songs.where({ bandId: id });
  });
}
