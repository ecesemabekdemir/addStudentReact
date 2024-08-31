import { useState, useEffect, useRef } from "react";
import "./App.css";

const savedData = localStorage.data ? JSON.parse(localStorage.data) : [];

function App() {
  const [data, setData] = useState(savedData);
  const dialogRef = useRef(null);

  useEffect(() => {
    localStorage.data = JSON.stringify(data);
  }, [data]);

  function addStudentRecord(record) {
    setData([...data, record]);
  }

  function updateRecord(record) {
    let foundRecord = data.find((x) => x.id === record.id);
    // referansı bozmamak için object assign kullanıyoruz
    // eğer referansı kırarsak bu sefer gösterim sırası bozulur
    // eğer bu notları çözemezseniz referansı kırıp arayüzde probleme odaklanın
    Object.assign(foundRecord, record);
    setData([...data]);
  }

  function deleteRecord(id) {
    if (!confirm("Emin misiniz?")) {
      return;
    }

    setData(data.filter((x) => x.id !== id));
    save();
  }

  // ... data mevcut data durumu
  // data.length +1 mevcut öğrenci üzerine eklemesi için
  //... record eklenen öğrenciden sonra mevcut durum

  return (
    <div className="container">
      <h1>
        Öğrenci bilgi sistemi <button className="addBtn" onClick={() => dialogRef.current.showModal()}>Yeni Ekle</button>
      </h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>#</li>
        </ul>
        {data.map((x) => (
          <StudentRow
            key={x.id}
            {...x}
            deleteRecord={deleteRecord}
            updateRecord={updateRecord}
          />
        ))}
      </div>
      <Modal addStudentRecord={addStudentRecord} dialogRef={dialogRef}  />
    </div>
  );
}

function Modal({dialogRef, addStudentRecord }) {



  function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = crypto.randomUUID();
    addStudentRecord(formObj);
    e.target.reset();
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <h2 className="modelAddNew">Kayıt Ekle</h2>
      <form
        className="formModal"
        method="dialog"
        onSubmit={handleSubmit}
      >
        <input required type="text" name="ad" placeholder="isim" />
        <input required type="text" name="soyad" placeholder="Soyisim" />
        <input
          required
          type="email"
          name="ePosta"
          placeholder="ePosta giriniz"
        />
        <input
          required
          type="date"
          name="dogumTarihi"
          placeholder="Doğum Tarihi"
        />
        <button className="modelAddNew" type="submit">
          Ekle
        </button>
        <button className="exit" type="button" onClick={() => dialogRef.current.close()}>
          Vazgeç
        </button>
      </form>
    </dialog>
  );
}
function StudentRow({
  id,
  ad,
  soyad,
  ePosta,
  dogumTarihi,
  updateRecord,
  deleteRecord,
}) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ? (
        <>
          <div className="studentTableCol">
            <input type="text" required name="ad" defaultValue={ad} />
          </div>
          <div className="studentTableCol">
            <input type="text" required name="soyad" defaultValue={soyad} />
          </div>
          <div className="studentTableCol">
            <input type="email" required name="ePosta" defaultValue={ePosta} />
          </div>
          <div className="studentTableCol">
            <input
              type="date"
              required
              name="dogumTarihi"
              defaultValue={dogumTarihi}
            />
          </div>
          <div className="studentTableCol">
            <button type="button" onClick={() => setEditing(false)}>
              vazgeç
            </button>
            <button className="saveBtn" type="submit">
              kaydet
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="studentTableCol">{ad}</div>
          <div className="studentTableCol">{soyad}</div>
          <div className="studentTableCol">{ePosta}</div>
          <div className="studentTableCol">
            {dogumTarihi.split("-").reverse().join(".")}
          </div>
          <div className="studentTableCol">
            <button type="button" onClick={() => setEditing(true)}>
              düzenle
            </button>
            <button
              className="delBtn"
              type="button"
              onClick={() => deleteRecord(id)}
            >
              sil
            </button>
          </div>
        </>
      )}
    </form>
  );
}
export default App;
