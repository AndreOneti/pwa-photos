export default class HtmlService {

  constructor(photosService) {
    this.photosService = photosService;
    this.imgToSave = null;
    this.start();
  }

  start() {
    this.getAllPhotos();
    document.querySelector('#imgFile').addEventListener('change', e => this.doFile(e));
    document.querySelector('#imgBtnSave').addEventListener('click', () => this.saveImg());
  }

  async doFile(e) {
    let file = e.target.files[0];
    if (!file) {
      this.imgToSave = null;
      return;
    }
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      let bits = e.target.result;
      this.imgToSave = { created: new Date(), data: bits, name: file.name };
    }
  }

  async saveImg() {
    let photoName = document.getElementById("imgName").value;
    if (photoName === '' || this.imgToSave === null) return;
    try {
      this.imgToSave.name = photoName;
      await this.photosService.save(this.imgToSave);
      this.imgToSave = null;
      document.querySelector('#imgFile').value = '';
      document.getElementById("imgName").value = '';
    } catch (error) {
      alert("Falha ao salvar foto!");
    } finally {
      this.getAllPhotos();
    }
  }

  async doImageTest() {
    let image = document.querySelector('#testImage');
    let recordToLoad = parseInt(document.querySelector('#recordToLoad').value, 10);
    if (recordToLoad === '') recordToLoad = 1;
    let photo = await this.photosService.get(recordToLoad);
    image.src = 'data:image/jpeg;base64,' + btoa(photo.data);
  }

  async getAllPhotos() {
    let imgs = await this.photosService.getAll();
    let ul = document.querySelector('ul');
    const creteLi = (acc, img) => acc +=
      `<li class="li-card"><img class="card" src=${'data:image/jpeg;base64,' + btoa(img.data)}></img><h4 class="li-desc"><span>${img.name}</span></h4></li>`;
    let lis = imgs.reduce(creteLi, '');
    ul.innerHTML = lis;
  }
}
