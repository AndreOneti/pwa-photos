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
    document.querySelector("#imgName").addEventListener('keyup', (key) => {
      if (key.key === "Enter") this.saveImg();
    });
    document.addEventListener('contextmenu', function (ev) {
      ev.preventDefault();
      console.log(ev);
    }, false);
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

  async delete(e) {
    let id = e.target.parentElement.key;
    await this.photosService.delete(id);
    e.target.parentElement.remove();
  }

  async getAllPhotos() {
    let imgs = await this.photosService.getAll();
    let imgcomponent = document.querySelector('.imgs');
    imgcomponent.innerHTML = '';
    imgs.forEach(img => {
      let figure = document.createElement('figure');
      figure.classList.add("fig-card");
      figure.key = img.id;
      let image = document.createElement('img');
      image.src = 'data:image/jpeg;base64,' + btoa(img.data);
      let figCap = document.createElement('figcaption');

      let descSpan = document.createElement('span');
      descSpan.classList.add("description");
      descSpan.innerText = img.name;

      let delSpan = document.createElement('span');
      delSpan.classList.add("delete");
      delSpan.innerText = " X ";
      delSpan.addEventListener('click', e => this.delete(e));

      figCap.append(descSpan);
      figure.append(image);
      figure.append(figCap);
      figure.append(delSpan);
      imgcomponent.append(figure);
    });

    // const creteLi = (acc, img) => acc +=
    //   `<figure class="fig-card">\
    //     <img src="${'data:image/jpeg;base64,' + btoa(img.data)}" />\
    //     <figcaption>\
    //       <span class="description">${img.name}</span>\
    //     </figcaption>\
    //     <span class="delete"> X </span>\
    //   </figure>`;
    // let lis = imgs.reduce(creteLi, '');
    // imgcomponent.innerHTML = lis;
  }
}
