import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    localStorage.data ? setData(JSON.parse(localStorage.data)) : setData([])
  },[]);
  useEffect(() => {
    if (data.length) {
      save();
    }
  }, [data]);

  function save() {
    localStorage.data = JSON.stringify(data);
  }

  function updateRecord(record) {
    let foundRecord = data.find((x) => x.id === record.id);
    Object.assign(foundRecord, record);
    setData([...data]);
    // save();
  }

  function deleteRecord(id) {
    if (!confirm("Emin misiniz?")) {
      return;
    }

    setData(data.filter((x) => x.id !== id));
    save();
  }

  function showModal() {
    // butona onclick vericez modal açılması içn
    setIsModalOpen(true);
  }

  function closeModal() {
    // modal kapanması için
    setIsModalOpen(false);
  }

  // ... data mevcut data durumu
  // data.length +1 mevcut öğrenci üzerine eklemesi için
  //... record eklenen öğrenciden sonra mevcut durum

  function addStudentRecord(record) {
    // yeni ekleme record parametresi formdan aldığım bilgi
    setData([...data, { id: data.length + 1, ...record }]); // yeni ögrenciyi dataya ekleme
    closeModal(); // modal kapat
    // save();
  }

  return (
    <div className="container">
      <h1>
        Öğrenci bilgi sistemi{" "}
        <button className="addBtn" onClick={showModal}>
          Yeni Ekle
        </button>
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
      <AddStudent
        isOpen={isModalOpen}
        closeModal={closeModal}
        addStudentRecord={addStudentRecord}
      />
    </div>
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
              <svg
                xmlns="http://www.w3.org/2000/svg/200/200"
                viewBox="0 0 512 512"
              >
                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
              </svg>
            </button>
            <button
              className="studentEditBtn"
              type="button"
              onClick={() => deleteRecord(id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </form>
  );
}

function AddStudent({ isOpen, addStudentRecord, closeModal }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    addStudentRecord(formObj);
  }

  return (
    <dialog id="modal" open={isOpen}>
      <h2 className="modelAddNew">Öğrenci Ekle</h2>
      <form
        className="formModal"
        method="dialog"
        autoComplete="off"
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
        <button className="exit" type="button" onClick={closeModal}>
          {" "}
          Vazgeç
        </button>
      </form>
    </dialog>
  );
}

export default App;
