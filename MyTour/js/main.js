$(document).on('ready', function () {

    //  инициализация календаря дат вылета
    function datepickerInit() {
        $('.datepicker-here').datepicker({
            minDate: new Date(), // Можно выбрать тольо даты, идущие за сегодняшним днем, включая сегодня
            toggleSelected: false //возомжность выбрать одну и ту же дату
        });
    }

    datepickerInit();

    //  создание новой подборки
    $('.selections').on('click', '.add-selection', function (event) {
        event.preventDefault();
        $.get('new-selection.html', function (data) {

            //  присвоение новой подборке уникального id
            var tabPan = $('.tab-pane');
            var newSelectionId;
            var nambNewId = 1;
            if (tabPan.length) {
                var lastId = tabPan.last().attr('id');
                nambNewId = parseInt(lastId.replace(/\D+/g, "")) + 1;
                newSelectionId = 'selection-' + nambNewId;
            } else {
                newSelectionId = 'selection-' + nambNewId;
            }
            var dataNewId = $(data).attr('id', newSelectionId);
            $('.tab-content').append(dataNewId);

            //  новый id для поля названия города и его автозаполнение 
            var autocompleteId = 'autocomplete-cities-' + nambNewId;
            dataNewId.find('.selection-city').attr('id', autocompleteId);
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById(autocompleteId), {
                language: 'ru',
                componentRestrictions: {
                    country: 'ru'
                },
                types: ['(cities)'] //тип выдаваемых мест https://developers.google.com/places/web-service/autocomplete?hl=ru
            });

            //  определение населенного пункта и запись в input
            geolocation();

            //  присвоение нового названия подборки
            var dataName = 'ПОДБОРКА №' + nambNewId;
            dataNewId.find('.selection-name').val(dataName);

            //  создание новой навигационной кнопки
            $('.nav-tabs li').last().before('<li role="presentation"><a href="#' + newSelectionId + '" aria-controls="' + newSelectionId + '" role="tab" data-toggle="tab">' + dataName + '</a></li>');

            //  инициализация календаря дат вылета
            datepickerInit();

            //  заполнение продолжительности отдыха
            var thishowManyNight = dataNewId.find('.how-many-night');
            var from = thishowManyNight.find('.from-date').val();
            var to = thishowManyNight.find('.to-date').val();
            thishowManyNight.prev('.inp-how-many-night').val(from + ' \u2015 ' + to + ' ночей');

            //  заполнение количества гостей
            var thishowManyPeople = dataNewId.find('.how-many-people');
            var adult = thishowManyPeople.find('.adult').val();
            var children = thishowManyPeople.find('.children').val();
            thishowManyPeople.prev('.inp-how-many-people').val(adult + ' взрослых, ' + children + ' детей');

            //  заполнение стоимости
            var thishowManyMoney = dataNewId.find('.how-many-money');
            var fromRub = thishowManyMoney.find('.from-rub').val();
            var toRub = thishowManyMoney.find('.to-rub').val();
            thishowManyMoney.prev('.inp-how-many-money').val(fromRub + ' Р \u2015 ' + toRub + ' Р');

            //  выбор рейтинга
            var thishowManyRating = dataNewId.find('.how-many-rating');
            var rating = thishowManyRating.find('.rating-select').val();
            thishowManyRating.prev('.block-rating').children('.inp-how-many-rating').val(rating);

            //  выбор типа питания
            var thisTypeFood = dataNewId.find('.type-food');
            var typeFood = thisTypeFood.find('.select-type-food').val();
            thisTypeFood.prev('.inp-type-food').val(typeFood);

            //  выбор расположения отеля
            var thisLocationHotel = dataNewId.find('.location-hotel');
            var locationHotel = thisLocationHotel.find('.select-location-hotel').val();
            thisLocationHotel.prev('.inp-location-hotel').val(locationHotel);

            $('.tab-pane').removeClass('active');
            $('.tab-pane').last().addClass('active');
            $('.nav-tabs li').removeClass('active');
            $('.nav-tabs li').last().prev().addClass('active');
        });
    });

    //  автозаполнение названия города на первой вкладке
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete-cities-1'), {
        language: 'ru',
        componentRestrictions: {
            country: 'ru'
        },
        types: ['(cities)'] //тип выдаваемых мест https://developers.google.com/places/web-service/autocomplete?hl=ru
    });

    //  определение населенного пункта и запись в input
    //  https://developers.google.com/maps/documentation/geocoding/intro?hl=ru
    function geolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
        } else {
            alert("Geolocation API не поддерживается в вашем браузере");
        }
    }

    //  функция успеха определения местоположения
    function geolocationSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var google_map_pos = new google.maps.LatLng(lat, lng);
        var google_maps_geocoder = new google.maps.Geocoder();
        google_maps_geocoder.geocode({
                'latLng': google_map_pos
            },
            function (results, status) {
                var city = results[2].formatted_address; //формат адреса по индексу results[]
                $('.selection-city').val(city);
            });
    }

    //  функция ошибки определения местоположения
    function geolocationFailure(positionError) {
        var errNamber = positionError.code;
        if (errNamber == 1) {
            alert("Ваш город не определен. Вы решили не предоставлять данные о своем местоположении.");
        } else if (errNamber == 2) {
            alert("Проблемы с сетью или нельзя связаться со службой определения местоположения по каким-либо другим причинам.");
        } else if (errNamber == 3) {
            alert("He удалось определить местоположение в течение установленного времени.");
        } else {
            alert("Неустановленная ошибка.");
        }
    }

    //  запуск функции: определение населенного пункта и запись в input
    geolocation();

    //    очистка input с городом пользователя
    $('.selections').on('click', '.city-reset', function (event) {
        event.preventDefault();
        $(event.target).prev('.selection-city').val('');
    });

    //  отправка формы
    $('.selections').on('submit', '.tab-pane form', function (event) {
        event.preventDefault();
        var form = $(this);
        var form_data = form.serialize(); // сбор данных с полей формы
        // получение названия подборки из input и запись его в nav-tabs
        var selectionNameVal = form.find('.selection-name').val();
        var tabPanId = '#' + form.parent('.tab-pane').attr('id');
        var navTabsA = form.closest('.selections').find('.nav-tabs a');
        navTabsA.each(function () {
            var a = $(this);
            if (a.attr('href') === tabPanId) {
                a.text(selectionNameVal);
            }
        });
        $.ajax({
            type: "POST",
            url: "form.php",
            data: form_data,
            success: function (data) {
                //  отображение полученных результатов
                form.parent('.tab-pane').append(data);
            },
            error: function (req, status, err) {
                alert('Возникла ошибка при отправке формы. Попробуйте еще раз.');
            }
        });
    });

    //  удаление выбранных стран
    $('.selections').on('click', '.country button', function (event) {
        event.preventDefault();
        $(this).closest('.country li').remove();
    });

    //      закрытие открытых блоков по клику вне их области
    $(document).on('click', function (event) {
        var buttonUlR = $('.button-ul-region');
        var ulButtonR = buttonUlR.find('.add-ul-button');
        if (!buttonUlR.is(event.target) && buttonUlR.has(event.target).length === 0) {
            ulButtonR.hide();
        }
        var buttonUlC = $('.button-ul-country');
        var ulButtonC = buttonUlC.find('.add-ul-button');
        if (!buttonUlC.is(event.target) && buttonUlC.has(event.target).length === 0) {
            ulButtonC.hide();
        }
        var popUpFilter = $('.pop-up-filter');
        var togglePopup = $('.toggle-popup');
        if (!popUpFilter.is(event.target) && popUpFilter.has(event.target).length === 0 && !togglePopup.is(event.target)) {
            popUpFilter.hide();
        }

    });

    //    по клику на кнопку скрываем-отбражаем блок со списком
    $('.selections').on('click', '.add-region-country', function (event) {
        event.preventDefault();
        var button = $(this);
        if (button.hasClass('button-disabled')) {
            return;
        } else {
            button.next('.add-ul-button').slideToggle(100);
            $('.add-region-country').not(event.target).next('.add-ul-button').hide();
        }
    });

    //  добавление галочки выбранным пунктам списка
    $('.selections').on('click', '.wrap-ul-add label', function (event) {
        var inputs = $('.wrap-ul-add input');
        inputs.each(function () {
            input = $(this);
            if (input.prop('checked')) {
                input.parent().addClass('icon-ok');
            } else {
                input.parent().removeClass('icon-ok');
            }
        });
    });

    //  массивы стран по принадлежности к региону
    var regions = {

        region1: [
            ['img/фл-индонезия.png', 'r1 - country1'],
            ['img/фл-вьетнам.png', 'r1 - country2'],
            ['img/фл-тайланд.png', 'r1 - country3'],
            ['img/фл-индонезия.png', 'r1 - country4'],
            ['img/фл-вьетнам.png', 'r1 - country5'],
            ['img/фл-тайланд.png', 'r1 - country6'],
            ['img/фл-индонезия.png', 'r1 - country7'],
            ['img/фл-тайланд.png', 'r1 - country8'],
            ['img/фл-вьетнам.png', 'r1 - country9'],
            ['img/фл-индонезия.png', 'r1 - country10']
        ],

        region2: [
            ['img/фл-индонезия.png', 'r2 - country1'],
            ['img/фл-вьетнам.png', 'r2 - country2'],
            ['img/фл-тайланд.png', 'r2 - country3'],
            ['img/фл-индонезия.png', 'r2 - country4'],
            ['img/фл-вьетнам.png', 'r2 - country5'],
            ['img/фл-тайланд.png', 'r2 - country6'],
            ['img/фл-индонезия.png', 'r2 - country7'],
            ['img/фл-тайланд.png', 'r2 - country8'],
            ['img/фл-вьетнам.png', 'r2 - country9'],
            ['img/фл-индонезия.png', 'r2 - country10']
        ],

        region3: [
            ['img/фл-индонезия.png', 'r3 - country1'],
            ['img/фл-вьетнам.png', 'r3 - country2'],
            ['img/фл-тайланд.png', 'r3 - country3'],
            ['img/фл-индонезия.png', 'r3 - country4'],
            ['img/фл-вьетнам.png', 'r3 - country5'],
            ['img/фл-тайланд.png', 'r3 - country6'],
            ['img/фл-индонезия.png', 'r3 - country7'],
            ['img/фл-тайланд.png', 'r3 - country8'],
            ['img/фл-вьетнам.png', 'r3 - country9'],
            ['img/фл-индонезия.png', 'r3 - country10']
        ],

        region4: [
            ['img/фл-индонезия.png', 'r4 - country1'],
            ['img/фл-вьетнам.png', 'r4 - country2'],
            ['img/фл-тайланд.png', 'r4 - country3'],
            ['img/фл-индонезия.png', 'r4 - country4'],
            ['img/фл-вьетнам.png', 'r4 - country5'],
            ['img/фл-тайланд.png', 'r4 - country6'],
            ['img/фл-индонезия.png', 'r4 - country7'],
            ['img/фл-тайланд.png', 'r4 - country8'],
            ['img/фл-вьетнам.png', 'r4 - country9'],
            ['img/фл-индонезия.png', 'r4 - country10']
        ],

        region5: [
            ['img/фл-индонезия.png', 'r5 - country1'],
            ['img/фл-вьетнам.png', 'r5 - country2'],
            ['img/фл-тайланд.png', 'r5 - country3'],
            ['img/фл-индонезия.png', 'r5 - country4'],
            ['img/фл-вьетнам.png', 'r5 - country5'],
            ['img/фл-тайланд.png', 'r5 - country6'],
            ['img/фл-индонезия.png', 'r5 - country7'],
            ['img/фл-тайланд.png', 'r5 - country8'],
            ['img/фл-вьетнам.png', 'r5 - country9'],
            ['img/фл-индонезия.png', 'r5 - country10']
        ],

        region6: [
            ['img/фл-индонезия.png', 'r6 - country1'],
            ['img/фл-вьетнам.png', 'r6 - country2'],
            ['img/фл-тайланд.png', 'r6 - country3'],
            ['img/фл-индонезия.png', 'r6 - country4'],
            ['img/фл-вьетнам.png', 'r6 - country5'],
            ['img/фл-тайланд.png', 'r6 - country6'],
            ['img/фл-индонезия.png', 'r6 - country7'],
            ['img/фл-тайланд.png', 'r6 - country8'],
            ['img/фл-вьетнам.png', 'r6 - country9'],
            ['img/фл-индонезия.png', 'r6 - country10']
        ],

        region7: [
            ['img/фл-индонезия.png', 'r7 - country1'],
            ['img/фл-вьетнам.png', 'r7 - country2'],
            ['img/фл-тайланд.png', 'r7 - country3'],
            ['img/фл-индонезия.png', 'r7 - country4'],
            ['img/фл-вьетнам.png', 'r7 - country5'],
            ['img/фл-тайланд.png', 'r7 - country6'],
            ['img/фл-индонезия.png', 'r7 - country7'],
            ['img/фл-тайланд.png', 'r7 - country8'],
            ['img/фл-вьетнам.png', 'r7 - country9'],
            ['img/фл-индонезия.png', 'r7 - country10']
        ],

        region8: [
            ['img/фл-индонезия.png', 'r8 - country1'],
            ['img/фл-вьетнам.png', 'r8 - country2'],
            ['img/фл-тайланд.png', 'r8 - country3'],
            ['img/фл-индонезия.png', 'r8 - country4'],
            ['img/фл-вьетнам.png', 'r8 - country5'],
            ['img/фл-тайланд.png', 'r8 - country6'],
            ['img/фл-индонезия.png', 'r8 - country7'],
            ['img/фл-тайланд.png', 'r8 - country8'],
            ['img/фл-вьетнам.png', 'r8 - country9'],
            ['img/фл-индонезия.png', 'r8 - country10']
        ],

        region9: [
            ['img/фл-индонезия.png', 'r9 - country1'],
            ['img/фл-вьетнам.png', 'r9 - country2'],
            ['img/фл-тайланд.png', 'r9 - country3'],
            ['img/фл-индонезия.png', 'r9 - country4'],
            ['img/фл-вьетнам.png', 'r9 - country5'],
            ['img/фл-тайланд.png', 'r9 - country6'],
            ['img/фл-индонезия.png', 'r9 - country7'],
            ['img/фл-тайланд.png', 'r9 - country8'],
            ['img/фл-вьетнам.png', 'r9 - country9'],
            ['img/фл-индонезия.png', 'r9 - country10']
        ],

        region10: [
            ['img/фл-индонезия.png', 'r10 - country1'],
            ['img/фл-вьетнам.png', 'r10 - country2'],
            ['img/фл-тайланд.png', 'r10 - country3'],
            ['img/фл-индонезия.png', 'r10 - country4'],
            ['img/фл-вьетнам.png', 'r10 - country5'],
            ['img/фл-тайланд.png', 'r10 - country6'],
            ['img/фл-индонезия.png', 'r10 - country7'],
            ['img/фл-тайланд.png', 'r10 - country8'],
            ['img/фл-вьетнам.png', 'r10 - country9'],
            ['img/фл-индонезия.png', 'r10 - country10']
        ]
    };

    //  добавление блока региона
    $('.selections').on('click', '.button-ul-region .add-item', function (event) {
        event.preventDefault();
        var thisRegionCountry = $(event.target).closest('.region-country');
        var thisAddUlButton = $(event.target).closest('.add-ul-button');
        var inputs = thisAddUlButton.find('input');
        inputs.each(function () {
            var input = $(this);
            if (input.prop('checked')) {
                //  кнопку "добавить регион" делаем неактивной
                input.closest('.button-ul-region').find('.add-region-country').addClass('button-disabled');
                //скрытие первичного блока с кнопками
                if (thisRegionCountry.find('.wrap-buttons').length == 1) {
                    thisRegionCountry.find('.wrap-buttons').hide();
                }
                thisAddUlButton.hide(); //скрытие всплывающего списка 
                var regionName = input.val();
                $.get('new-region-country.html', function (data) { //ajax загрузка блока
                    var newRegionCountry = $(data);
                    thisRegionCountry.append(newRegionCountry);
                    //присвоение названия по выбранному input
                    newRegionCountry.find('.wrap-ul-region-country h3').text(regionName);
                    for (var regionKey in regions) { //заполнение всплывающего блока странами соответствцющими выбранному региону
                        if (regionKey === regionName) {
                            $.each(regions[regionKey], function (i, countryDate) { //доступ к данным по ключу в переменной
                                newRegionCountry.find('.button-ul-country ul').append('<li><label><img src=' + countryDate[0] + '>' + countryDate[1] + '<input type="checkbox" name="country" value=" ' + countryDate[1] + ' "></label></li>');
                            });
                        }
                    };
                });
                input.removeAttr('checked');
                input.parent().removeClass('icon-ok');
            }
        });
    });

    //  добавление стран в блок региона
    $('.selections').on('click', '.button-ul-country .add-item', function (event) {
        event.preventDefault();
        var inputs = $(event.target).closest('.add-ul-button').find('input');
        inputs.each(function () {
            var input = $(this);
            if (input.prop('checked')) {
                $('.add-ul-button').hide();
                var countryName = input.val();
                var countryFlag = input.prev('img').attr('src');
                var addLi = '<li><img src="' + countryFlag + '"><input type="text" value="' + countryName + '" readonly><button type="button" class="icon-cancel"></button></li>';
                // проверка на отсутствие стран в блоке отображения выбора
                var inputsUlCountry = $(event.target).parents('.new-region-country').find('ul.country input');
                var bool = true;
                inputsUlCountry.each(function () {
                    var inputVal = $(this).val();
                    if (countryName === inputVal) { //сравнение val выбранных стран с val стран которые уже отображены
                        bool = false;
                    }
                });
                if (bool) {
                    $(event.target).parents('.new-region-country').find('ul.country').append(addLi);
                }
            }
        });
    });

    //  выбор продолжительности
    var howManyNight = $('.how-many-night');
    howManyNight.each(function (i) {
        if (i === 0) {
            var thishowManyNight = $(this);
            var from = thishowManyNight.find('.from-date').val();
            var to = thishowManyNight.find('.to-date').val();
            thishowManyNight.prev('.inp-how-many-night').val(from + ' \u2015 ' + to + ' ночей');
        } else return;
    });

    $('.selections').on('click', '.how-many-night select', function (event) {
        var thishowManyNight = $(event.target).closest('.how-many-night');
        var from = thishowManyNight.find('.from-date').val();
        var to = thishowManyNight.find('.to-date').val();
        if (parseInt(from) < parseInt(to)) {
            thishowManyNight.prev('.inp-how-many-night').val(from + ' \u2015 ' + to + ' ночей');
        } else {
            thishowManyNight.prev('.inp-how-many-night').val('7 \u2015 14 ночей');
        }
    });

    //  открытие-закрытие всплывающих окон по клику на input
    $('.selections').on('click', '.toggle-popup', function (event) {
        $(event.target).next('.pop-up-filter').slideToggle(100);
        $('.toggle-popup').not(event.target).next('.pop-up-filter').hide();
    });

    //  выбор количества гостей
    $('.how-many-people').each(function (i) {
        if (i === 0) {
            var thishowManyPeople = $(this);
            var adult = thishowManyPeople.find('.adult').val();
            var children = thishowManyPeople.find('.children').val();
            thishowManyPeople.prev('.inp-how-many-people').val(adult + ' взрослых, ' + children + ' детей');
        } else return;
    });

    $('.selections').on('click', '.how-many-people select', function (event) {
        var thishowManyPeople = $(event.target).closest('.how-many-people');
        var adult = thishowManyPeople.find('.adult').val();
        var children = thishowManyPeople.find('.children').val();
        if (parseInt(children) === 0) {
            thishowManyPeople.prev('.inp-how-many-people').val(adult + ' взрослых');
        } else {
            thishowManyPeople.prev('.inp-how-many-people').val(adult + ' взрослых, ' + children + ' детей');
        }
    });

    //  выбор стоимости
    $('.how-many-money').each(function (i) {
        if (i === 0) {
            var thishowManyMoney = $(this);
            var from = thishowManyMoney.find('.from-rub').val();
            var to = thishowManyMoney.find('.to-rub').val();
            thishowManyMoney.prev('.inp-how-many-money').val(from + ' Р \u2015 ' + to + ' Р');
        } else return;
    });

    $('.selections').on('click', '.how-many-money select', function (event) {
        var thishowManyMoney = $(event.target).closest('.how-many-money');
        var from = thishowManyMoney.find('.from-rub').val();
        var to = thishowManyMoney.find('.to-rub').val();
        if (parseInt(from) < parseInt(to)) {
            thishowManyMoney.prev('.inp-how-many-money').val(from + ' Р \u2015 ' + to + ' Р');
        } else {
            thishowManyMoney.prev('.inp-how-many-money').val('50 000 Р \u2015 150 000 Р');
        }
    });

    //  выбор категории звезд
    $('.selections').on('click', '.block-star .icon-star', function (event) {
        var inputCheckVal = $(event.target).children().val();
        var thisInput = $(event.target).parent('.block-star').find('input');
        thisInput.each(function () {
            var inputVal = $(this).val();
            if (inputVal <= inputCheckVal) {
                $(this).parent('.icon-star').addClass('active-star');
            } else {
                $(this).parent('.icon-star').removeClass('active-star');
            }
        });
    });

    //  выбор рейтинга
    $('.how-many-rating').each(function (i) {
        if (i === 0) {
            var thishowManyRating = $(this);
            var rating = thishowManyRating.find('.rating-select').val();
            thishowManyRating.prev('.block-rating').children('.inp-how-many-rating').val(rating);
        } else return;
    });

    $('.selections').on('click', '.how-many-rating select', function (event) {
        var thishowManyRating = $(event.target).closest('.how-many-rating');
        var rating = thishowManyRating.find('.rating-select').val();
        thishowManyRating.prev('.block-rating').children('.inp-how-many-rating').val(rating);
    });

    //  выбор типа питания
    $('.type-food').each(function (i) {
        if (i === 0) {
            var thisTypeFood = $(this);
            var typeFood = thisTypeFood.find('.select-type-food').val();
            thisTypeFood.prev('.inp-type-food').val(typeFood);
        } else return;
    });

    $('.selections').on('click', '.type-food select', function (event) {
        var thisTypeFood = $(event.target).closest('.type-food');
        var typeFood = thisTypeFood.find('.select-type-food').val();
        thisTypeFood.prev('.inp-type-food').val(typeFood);
    });

    //  выбор расположения отеля
    $('.location-hotel').each(function (i) {
        if (i === 0) {
            var thisLocationHotel = $(this);
            var locationHotel = thisLocationHotel.find('.select-location-hotel').val();
            thisLocationHotel.prev('.inp-location-hotel').val(locationHotel);
        } else return;
    });

    $('.selections').on('click', '.location-hotel select', function (event) {
        var thisLocationHotel = $(event.target).closest('.location-hotel');
        var locationHotel = thisLocationHotel.find('.select-location-hotel').val();
        thisLocationHotel.prev('.inp-location-hotel').val(locationHotel);
    });

    //  удаление подборки
    $('.selections').on('click', '.del-selection', function () {
        var thisTabPane = $(event.target).closest('.tab-pane'); //  данная подборка
        var idTabPan = thisTabPane.attr('id');
        var thisLi = $('.selections a[href="#' + idTabPan + '"]').parent('li');
        if (thisLi.prev().length) {
            thisLi.prev().addClass('active');
        } else {
            thisLi.next().addClass('active');
        }
        thisLi.remove();
        if (thisTabPane.prev().length) {
            thisTabPane.prev().addClass('active');
        } else {
            thisTabPane.next().addClass('active');
        }
        thisTabPane.remove();
    });

});
