
window.onload = function(){
    filter_content()
    console.log("Waves!!!")
    california();

}


function filter_content(){
  const months = ["January", "Febuary", "March", "April",
    "May", "June", "July", "August", "Semptember", "October", "November", "December"]
  console.log("filter test!")
  for (let i = 0; i < 12; i++){
    $("#month").append(`
        <label>
                <input type="checkbox" name="month[]" value=${months[i]}>
                <span>${months[i]}</span>

        </label>
  `)

  }
  

}

function florida(){
  $("#beach-listings").empty()
  $("#state-header").empty()


  $.ajax({
      type: 'GET',
      url: `https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/AQUATIC_PRESERVES/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json`,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){
          let count = 0;
          let image = "images/sample-beach1a.jpg"
          console.log(result.features[0].attributes.BEACH_OR_CITY_NAME)
          console.log(result.features[0].attributes)
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
  console.log("TEST 1")
  $("#state-header").empty()



  $.ajax({
      type: 'GET',
      url: `https://api.coastal.ca.gov/access/v1/locations`,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){
        $("#state-header").html(`<h3>California Beaches<h3>`)


          console.log("TEST 2")


          let count = 0;
          let image;

          for(let i = 0; i < 130; i++){
            image = "images/sample-beach1a.jpg";

            if (result[i].Photo_1){
              image = result[i].Photo_1;

            }

            if (result[i].FISHING == "Yes"){

                  count++;
                  $("#beach-listings").append(`

                  <div class="col-12 col-sm-4 col-lg-3 beach-item">

            <div class="card border-0">
                <img class="card-img-top beach-img " src=${image}>
                <div class="card-info">
                    <h3 class="card-title">${result[i].NameMobileWeb}</h3>
                      <p class="text-royal pl-3 pt-2">${result[i].LocationMobileWeb}</p>
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