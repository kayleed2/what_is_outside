window.onload = function(){
    content()
    california();

}




const months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "Semptember", "October", "November", "December"]
let selected_months = []

const subjects = ["apple_frame", "aurora_borealis", "barn", "beach", "boat", "bridge",
    "building", "bushes", "cabin", "cactus", "circle_frame", "cirrus", "cliff", "clouds",
    "conifer", "cumulus", "deciduous", "diane_andre", "dock", "double_oval_frame",
    "farm", "fence", "fire", "florida_frame", "flowers", "fog", "framed", "grass",
    "guest", "half_circle_frame", "half_oval_frame", "hills", "lake", "lakes", "lighthouse",
    "mill", "moon", "mountain", "mountains", "night", "ocean", "oval_frame", "palm_trees",
    "path", "person", "portrait", "rectangle_3d_frame", "rectangular_frame", "river",
    "rocks", "seashell_frame", "snow", "snowy_mountain", "split_frame", "steve_ross",
    "structure", "sun", "tomb_frame", "tree", "trees", "triple_frame", "waterfall",
    "waves", "windmill", "window_frame", "winter", "wood_framed"]
let selected_subjects = []

const colors = ["black_gesso", "bright_red", "burnt_umber", "cadmium_yellow", "dark_sienna",
    "indian_red", "indian_yellow", "liquid_black", "liquid_clear", "midnight_black", "phthalo_blue",
    "phthalo_green", "prussian_blue", "sap_green", "titanium_white", "van_dyke_brown", "yellow_ochre",
    "alizarin_crimson"]
let selected_colors = []


function content(){

  for (let i = 0; i < months.length; i++){
    $("#month").append(`
        <li>
          <input type="checkbox" name="month[]" value=${months[i]} id=${months[i]} onclick="checkbox(this, selected_months)">
          <span>${months[i]}</span>
        </li>
    `)
  }

  for (let i = 0; i < subjects.length; i++){
    $("#subject").append(`
        <li>
                <input type="checkbox" name="month[]" value=${subjects[i]} id=${subjects[i]} onclick="checkbox(this, selected_subjects)">
                <span>${subjects[i]}</span>

        </li>
    `)
  }

  for (let i = 0; i < colors.length; i++){
    $("#color").append(`
        <li>
                <input type="checkbox" name="month[]" value=${colors[i]} id=${colors[i]} onclick="checkbox(this, selected_colors)">
                <span>${colors[i]}</span>

        </li>
    `)
  }

  $(".filter").append(`
  <button id="submit" onclick="submit()">Submit</button>

  `)


//   let subject = document.getElementById("exampleFormControlInput1");
//   subject.addEventListener("keyup", (event) => {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         document.getElementById("submit").click();
//     }
// })

}


function submit(){
  let input = document.getElementById("exampleFormControlInput1")
  const subject = input.value
  console.log("submit")
  console.log(subject)
}


function checkbox(element, array){
  if ($(element).is(':checked')) { 
    array.push(element.value)
  }
  else{
    console.log("no")
    var monthIndex = array.indexOf(element.value);//get  "car" index
    array.splice(monthIndex, 1)
  }
}















function florida(){
  $("#beach-listings").empty()
  $("#state-header").empty()


  $.ajax({
      type: 'GET',
      url: `http://localhost:5000/filter`,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){
          let count = 0;
          // let image = "images/sample-beach1a.jpg"
          // console.log(result.features[0].attributes.BEACH_OR_CITY_NAME)
          // console.log(result.features[0].attributes)
          $("#state-header").html(`<h3>Florida Beaches<h3>`)
          for(let i = 0; i < 50; i++){
              count++;
              $("#beach-listings").append(`
              <div class="col-12 col-sm-4 col-lg-3 beach-item">
                <div class="card border-0">
                  <img class="card-img-top beach-img " src=${image}>
                      <div class="card-info">
                          <h3 class="card-title">${result.features[i].attributes.BEACH_OR_CITY_NAME}</h3>
                          <p class="text-royal pl-3 pt-2">${result.features[i].attributes.LOCATION_ADDRESS}</p>
                      </div>

                </div>
              </div>`)


          }
          $("#count").text(`${count} beaches`)
          beachPagination(count)


      }

  });


}



function california(){
  $("#beach-listings").empty()
  $("#state-header").empty()

  url = 'http://localhost:8000/filter?'
  for (let i = 0; i < selected_months.length; i++) {
    url += `months=${selected_months[i]}&`
  }

  for (let i = 0; i < selected_subjects.length; i++) {
    url += `subjects=${selected_subjects[i]}&`
  }

  for (let i = 0; i < selected_colors.length; i++) {
    url += `colors=${selected_colors[i]}&`
  }

  $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){
        $("#state-header").html(`<h3>Your Paintings:<h3>`)



          let count = 0;
          let image;

          for(let i = 0; i < result.length; i++){
            // image = "images/sample-beach1a.jpg";

            // if (result[i].Photo_1){
            //   image = result[i].Photo_1;

            // }
            if (result[i]){
                  count++;
                  $("#beach-listings").append(`
                    <div class="col-12 col-sm-4 col-lg-3 beach-item">
                      <div class="card border-0">
                        <img class="card-img-top beach-img " src=${result[i].img_src}>
                        <div class="card-info">
                          <h3 class="card-title">${result[i].title}</h3>
                            <p class="text-royal pl-3 pt-2">${result[i].date}</p>
                        </div>
                      </div>
                    </div>
                  `)

            }
        }
          $("#count").text(`${count} beaches`)
          beachPagination(count)

      }


  });

}


function getPageList(totalPages, page, maxLength){

  function range(start, end){

    return Array.from(Array(end - start + 1), (_, i) => i + start);
  }
  var sideWidth = maxLength < 9 ? 1 : 30;
  var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
  var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

  if(totalPages <= maxLength){
    return range(1, totalPages);
  }

  if(page <= maxLength - sideWidth - 1 - rightWidth){
    return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
  }

  if(page >= totalPages - sideWidth - 1 - rightWidth){
    return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
  }

  return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}

function beachPagination(count){

  var numberOfItems = count;
  var limitPerPage = 8; //How many card items visible per a page
  var totalPages = Math.ceil(numberOfItems / limitPerPage);
  var paginationSize = 7; //How many page elements visible in the pagination
  var currentPage;

  function showPage(whichPage){

    if(whichPage < 1 || whichPage > totalPages) return false;

    currentPage = whichPage;

    $("#beach-listings .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

    $(".pagination li").slice(1, -1).remove();

    getPageList(totalPages, currentPage, numberOfItems).forEach(item => {
      $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
      .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
      .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
    });

    $(".previous-page").toggleClass("disable", currentPage === 1);
    $(".next-page").toggleClass("disable", currentPage === totalPages);
    return true;
  }

  $(".pagination").append(
    $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
    $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
  );

  $("#beach-listings").show();
  showPage(1);

  $(document).on("click", ".pagination li.current-page:not(.active)", function(){
    return showPage(+$(this).text());
  });

  $(".next-page").on("click", function(){
    return showPage(currentPage + 1);
  });

  $(".previous-page").on("click", function(){
    return showPage(currentPage - 1);
  });
};












$(function () {

    // init feather icons
    feather.replace();

    // init tooltip & popovers
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    //page scroll
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 20
        }, 1000);
        event.preventDefault();
    });

    // slick slider
    $('.slick-about').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: false
    });

    //toggle scroll menu
    var scrollTop = 0;
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        //adjust menu background
        if (scroll > 80) {
            if (scroll > scrollTop) {
                $('.smart-scroll').addClass('scrolling').removeClass('up');
            } else {
                $('.smart-scroll').addClass('up');
            }
        } else {
            // remove if scroll = scrollTop
            $('.smart-scroll').removeClass('scrolling').removeClass('up');
        }

        scrollTop = scroll;

        // adjust scroll to top
        if (scroll >= 600) {
            $('.scroll-top').addClass('active');
        } else {
            $('.scroll-top').removeClass('active');
        }
        return false;
    });

    // scroll top top
    $('.scroll-top').click(function () {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000);
    });

    /**Theme switcher - DEMO PURPOSE ONLY */
    $('.switcher-trigger').click(function () {
        $('.switcher-wrap').toggleClass('active');
    });
    $('.color-switcher ul li').click(function () {
        var color = $(this).attr('data-color');
        $('#theme-color').attr("href", "css/" + color + ".css");
        $('.color-switcher ul li').removeClass('active');
        $(this).addClass('active');
    });
});

// Kaylee's JS for signup

function showWelcomeMessageOrForm() {
  $.ajax({
    type: 'GET',
    url: `http://localhost:8000/sessions`,
    dataType: 'json',
    data: {"email": email, "password": password},
    beforeSend:  function(){
        $(".loader").show()
    },
    complete: function(){
        $(".loader").hide()
    },
    success: function(result){
      console.log(result)
      alert("Successful signup")
    },
  })
  // if (Cookies.get('email') == null ) {
  //   showForm();
  // } else {
  //   hideForm();
  // }
}

function hideForm() {
  let formdiv = document.getElementById('cont');
  formdiv.style.display = 'none';
  $('#signup').append(`<div class="p-5 mt-4 mb-4 d-flex flex-column justify-content-center align-items-center" id="members">
  <h1 class="text-white text-center"><br>You are all signed up!</h1>
  <a href="#"><button type="button" class="btn btn-secondary m-3 font-weight-bold border-0" style="background-color: var(--accent-lightblue);" id="member">Member Login</button></a>
  </div>`);


}

function showForm() {
  let formdiv = document.getElementById('cont');
  formdiv.style.display = 'block';
  if (document.getElementById('member')) {
      let it = document.getElementById('member');
      it.style.display = 'none';
      formdiv.style.display = 'block';
  }
}

const saveFile = function () {
  let email = $('#email-input').val();
  let password = $('#password-input').val();
  let user = {};
  user["email"] = email;
  user["password"] = password;
  Cookies.set('user', JSON.stringify(user), { expires: 14, path: '' });

$("#myForm").submit(function(event) {

  $.ajax({
    type: 'POST',
    url: `http://localhost:8000/users`,
    dataType: 'json',
    data: {"email": email, "password": password},
    beforeSend:  function(){
        $(".loader").show()
    },
    complete: function(){
        $(".loader").hide()
    },
    success: function(result){
      console.log(result)
      alert("Successful signup")
    },
  })

  $.ajax({
    type: 'POST',
    url: `http://localhost:8000/sessions`,
    dataType: 'json',
    data: {"email": email, "password": password},
    beforeSend:  function(){
        $(".loader").show()
    },
    complete: function(){
        $(".loader").hide()
    },
    success: function(result){
      console.log(result)
      alert("Successful signup")
    },
  })
});
}
