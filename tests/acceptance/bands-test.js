import { module, test } from 'qunit';
import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirageTest from 'ember-cli-mirage/test-support/setup-mirage';
import { loginAs, createBand, createSong } from 'rarwe/tests/helpers/custom-helpers';
module('Acceptance | Bands', function(hooks) {
  setupApplicationTest(hooks);
  setupMirageTest(hooks);

  test('Visit landing page without signing in', async function(assert) {
    await visit('/');
    assert.dom('[data-test-rr=form-header]').hasText('Log in to R&R');
    assert.dom('[data-test-rr=user-email]').doesNotExist();
  });
  
  test('List bands', async function(assert) {
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });
    await loginAs('dave@tcv.com');
    await visit('/');
    assert.dom('[data-test-rr=band-link]').exists({ count: 2 }, 'All band links are rendered');
    assert.dom('[data-test-rr=band-list-item]:first-child').hasText("Radiohead", 'The first band link contains the band name');
    assert.dom('[data-test-rr=band-list-item]:last-child').hasText("Long Distance Calling", 'The other band link contains the band name');
  });

  test('Create a band', async function(assert) {
    this.server.create('band', { name: 'Royal Blood' });
    await loginAs('dave@tcv.com');
    await visit('/');
    await createBand('Caspian');
    assert.dom('[data-test-rr=band-list-item]').exists({ count: 2 }, 'A new band link is rendered');
    assert.dom('[data-test-rr=band-list-item]:last-child').hasText('Caspian', 'The new band link is rendered as the last item');
    assert.dom('[data-test-rr=songs-nav-item] >.active').hasText('Songs', 'The Songs tab is active');
  });

  test('Create a song', async function(assert) {
    this.server.create('band', { name: 'killers' });
    await loginAs('dave@tcv.com');
    await visit('/bands/1/songs');
    await createSong('Blu');
    await fillIn('[data-test-rr=new-song-input]', 'Red');
    await click('[data-test-rr=new-song-button]');
    assert.dom('[data-test-rr=song-list-item]').exists({ count: 2 }, 'A new song is rendered');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('Red', 'The new song is rendered as the last item');
    assert.dom('[data-test-rr=songs-nav-item] >.active').hasText('Songs', 'The Songs tab is active');
  });

  test('Sort songs in various ways', async function(assert) {
    let band = this.server.create('band', { name: 'Them Crooked Vultures' });
    this.server.create('song', { title: 'Elephants', rating: 5, band });
    this.server.create('song', { title: 'New Fang', rating: 4, band });
    this.server.create('song', { title: 'Mind Eraser, No Chaser', rating: 4, band });
    this.server.create('song', { title: 'Spinning in Daffodils', rating: 5, band });

    await loginAs('dave@tcv.com');
    await visit('/');
    await click('[data-test-rr=band-link]');
    assert.equal(currentURL(), '/bands/1/songs');
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('Elephants', 'default: The first song is the highest ranked, first one in the alphabet');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('New Fang', 'default: The last song is the lowest ranked, last one in the alphabet');

    await click('[data-test-rr=sort-by-rating-asc]');
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc');
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('Mind Eraser, No Chaser', 'ratingAsc: The first song is the one that comes last in the alphabet');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('Spinning In Daffodils', 'ratingAsc: The last song is the one that comes first in the alphabet');

    await click('[data-test-rr=sort-by-rating-desc]');
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingDesc');
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('Elephants', 'ratingDesc: The first song is the highest ranked, first one in the alphabet');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('New Fang', 'ratingDesc: The last song is the lowest ranked, last one in the alphabet');

    await click('[data-test-rr=sort-by-title-desc]');
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc');
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('Spinning In Daffodils', 'titleDesc: The first song is the one that comes last in the alphabet');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('Elephants', 'titleDesc: The last song is the one that comes first in the alphabet');

    await click('[data-test-rr=sort-by-title-asc]');
    assert.equal(currentURL(), '/bands/1/songs?sort=titleAsc');
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('Elephants', 'titleAsc: The first song is the one that comes last in the alphabet');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('Spinning In Daffodils', 'titleAsc: The last song is the one that comes first in the alphabet');
  });

  test('Search songs', async function(assert) {
    let band = this.server.create('band', {name: 'Them Crooked Vultures' });
    this.server.create('song', { title: 'Elephants', rating: 5, band });
    this.server.create('song', { title: 'New Fang', rating: 4, band });
    this.server.create('song', { title: 'Mind Eraser, No Chaser', rating: 4, band });
    this.server.create('song', { title: 'Spinning in Daffodils', rating: 5, band });
    this.server.create('song', { title: 'No One Loves Me & Neither Do I', rating: 5, band });

    await loginAs('dave@tcv.com');
    await visit('/');
    await click('[data-test-rr=band-link]');
    await fillIn('[data-test-rr=search-box]', 'no');
    assert.equal(currentURL(), '/bands/1/songs?s=no');
    assert.dom('[data-test-rr=song-list-item]').exists({ count: 2 }, 'The songs matching the search are displayed');
    
    await click('[data-test-rr=sort-by-title-desc]');
    assert.ok(currentURL().includes('s=no'));
    assert.ok(currentURL().includes('sort=titleDesc'));
    assert.dom('[data-test-rr=song-list-item]:first-child').hasText('No One Loves Me & Neither Do I', 'A matching song that comes later in the alphabet appears on top');
    assert.dom('[data-test-rr=song-list-item]:last-child').hasText('Mind Eraser, No Chaser', 'A matching song that comes sooner in the alphabet appears at the bottom');
  });
});
