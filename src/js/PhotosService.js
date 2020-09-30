var db;

export default class PhotosService {

  constructor() {
    this.initializeDb();
  }

  initializeDb() {
    db = new dbIndexed("photos");

    db.version(1).stores({
      photos: '++id,&name'
    });
  }

  getAll() {
    return db.photos.getAll();
  }

  get(id) {
    return db.photos.get(id);
  }

  clear() {
    return db.photos.clear();
  }

  save(photo) {
    return db.photos.add(photo);
  }

  delete(id) {
    return db.photos.delete(id);
  }
}
