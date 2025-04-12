<template>
    <Header />
    <main>
      <div class="holder" style="overflow-y: hidden;">
        <dialog class="popup" style="overflow-y: hidden;">
          <div class="content" style="overflow-y: hidden;">
            <h1 style="text-align: center;">Изменить объявление</h1>
            <div class="row">
              <div class="col-md-6">
                <label for="nameOrder">Введите название объявления</label>
                <p>
                  <input
                    type="text"
                    name="nameOrder"
                    id="nameOrder"
                    placeholder="Например: Ремонт машин"
                    class="custom-text"
                    style="width: 100%;"
                    maxlength="50"
                  ></input>
                </p>
                <label for="noteOrder">Введите описание для вашего объявления</label>
                <p>
                  <textarea
                    class="custom-text wrap-text"
                    name="noteOrder"
                    id="noteOrder"
                    rows="14"
                    cols="10"
                    wrap="soft"
                    style="width: 100%;"
                  ></textarea>
                </p>
                <label for="priceOrder">Введите цену на услугу (Цена в рублях)</label>
                <p>
                  <input
                    type="text"
                    name="priceOrder"
                    id="priceOrder"
                    placeholder="Например: 2000"
                    class="custom-text"
                    style="width: 100%;"
                    maxlength="10"
                  ></input>
                </p>
                <label for="categoryOrder">Выберите категорию вашего объявления</label>
                <p>
                  <select id="categoryOrder" class="select" name="category">
                    <option value="waterTech">Сантехника</option>
                    <option value="electroTech">Электроника</option>
                    <option value="scepIT">IT</option>
                    <option value="household">Бытовая техника</option>
                    <option value="hire">Услуга по найму</option>
                    <option value="another">Другое</option>
                  </select>
                </p>
                <label for="your-picture">Прикрепите Ваше фото</label>
                <p>
                  <input
                    type="file"
                    id="your-picture"
                    name="your-picture"
                    accept=".jpg, .jpeg, .png"
                  ></input>
                </p>
              </div>
              <div class="col-md-6">
                <div style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px;">
                  <div class="preview" id="previewContainer">
                    <img id="preview" src="#" alt="Предпросмотр" />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center" style="align-items: center; justify-content: center;">
              <button type="button" class="btn custom-btn" id="change">Изменить объявление</button>
              <button type="button" class="btn custom-btn" id="delete" style="color: #f2f2f2; background-color: #d9534f;">Удалить объявление</button>
              <button type="button" class="btn custom-btn" id="cancel">Отмена</button>
            </div>
          </div>
        </dialog>
      </div>
  
      <div class="row" style="display: flex; justify-content: center;">
        <div class="col-md-5">
          <h1 class="head">Все объявления:</h1>
          <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" onkeyup="finding()" placeholder="Поиск по названию или типу">
          <select id="filter" class="select" name="filter" style="width:150px; padding-left: 5px;">
            <option value="name" selected="selected">Название</option>
            <option value="type">Тип услуги</option>
          </select>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 500px">
            <table class="table table-striped w-100" id="myTable">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">№</th>
                  <th scope="col" style="font-size: 15px;">Название</th>
                  <th scope="col" style="font-size: 15px;">Тип услуги</th>
                  <th scope="col" style="font-size: 15px;">Сумма (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Дата</th>
                  <th scope="col" style="font-size: 15px;">Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr class="dialogbar">
                  <td>1</td>
                  <td>Услуги сантехника</td>
                  <td>Сантехника</td>
                  <td>5000.00</td>
                  <td>19.06.2004</td>
                  <td>Бла-бла...</td>
                </tr>
                <!-- Остальные строки -->
                <tr>
                  <td>2</td>
                  <td>Услуги электрика</td>
                  <td>Сантехника</td>
                  <td>10000.00</td>
                  <td>19.06.2004</td>
                  <td>Активно</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div class="col-md-5">
          <h1 class="head">Сделки:</h1>
          <div style="margin: 10px 0 12px 0">
            <input id="all" type="button" class="btn custom-btn" value="Все"></input>
            <input id="active" type="button" class="btn custom-btn" value="Активно"></input>
            <input id="finished" type="button" class="btn custom-btn" value="Завершено"></input>
            <input id="declined" type="button" class="btn custom-btn" value="Отклонено"></input>
          </div>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 500px">
            <table class="table table-striped w-100" id="myTable1">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">№</th>
                  <th scope="col" style="font-size: 15px;">Пользователь 1</th>
                  <th scope="col" style="font-size: 15px;">Пользователь 2</th>
                  <th scope="col" style="font-size: 15px;">Сумма (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Дата</th>
                  <th scope="col" style="font-size: 15px;">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Услуги сантехника</td>
                  <td>Сантехника</td>
                  <td>5000.00</td>
                  <td>19.06.2004</td>
                  <td>Активно</td>
                </tr>
                <!-- Остальные строки -->
                <tr>
                  <td>2</td>
                  <td>Услуги электрика</td>
                  <td>Сантехника</td>
                  <td>10000.00</td>
                  <td>19.06.2004</td>
                  <td>Активно</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style="height: 150px;"></div>
    </main>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
name: 'Admin',
components: {
    Header,
    Footer,
},
}
</script>