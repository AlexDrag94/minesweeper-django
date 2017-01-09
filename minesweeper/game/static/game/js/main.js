

$(document).ready(function() {

  // var csrftoken = $.cookie('csrftoken');
  //
  // function csrfSafeMethod(method) {
  //     // these HTTP methods do not require CSRF protection
  //     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  // }
  //
  // $.ajaxSetup({
  //     beforeSend: function(xhr, settings) {
  //         if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
  //             xhr.setRequestHeader("X-CSRFToken", csrftoken);
  //         }
  //     }
  // });





  var x, y, oldX, oldY,
   numBombs, tiles, bombs, neighbours, pressed, flags, spawned;

  function clear(i, j) {
    pressed[i][j] = true;
    if(flags[i][j]) {
      $(tiles[i][j]).empty();
    }
    $(tiles[i][j]).css('background-color', 'whitesmoke');
    if(neighbours[i][j] > 0) {
      $(tiles[i][j]).html(neighbours[i][j]);
    }
    else {
      for(var k = i - 1; k <= i + 1 && k < x; k ++) {
        for(var l = j - 1; l <= j + 1 && l < y; l ++) {
          if(k >= 0 && l >= 0 && !pressed[k][l]) {
            clear(k, l);
          }
        }
      }
    }
  }

  function spawn(a, b) {
    spawned = true;
    var bombsCount = 0;
    var randX;
    var randY;

    while(bombsCount !== numBombs) {
      randX = Math.floor(Math.random() * x);
      randY = Math.floor(Math.random() * y);
      if(!bombs[randX][randY] &&
        (randX < a - 2 || randX > a + 2 || randY < b - 2 || randY > b + 2)) {
        bombs[randX][randY] = true;
        bombsCount ++;
      }
    }

    for(var i = 0; i < x; i ++) {
      for(var j = 0; j < y; j ++) {

        for(var k = i - 1; k <= i + 1 && k < x; k ++) {
          for(var l = j - 1; l <= j + 1 && l < y; l ++) {
            if(k >= 0 && l >= 0 && bombs[k][l]) {
              neighbours[i][j] ++;
            }
          }
        }

      }
    }
  }

  $('.history').click(function() {
    $('.game').hide();
    $('.list').slideDown();
  })

  $('.back').click(function() {
    $('.list').hide();
    $('.game').slideDown();
  })

  $('.create').click(function() {

    oldX = x;
    oldY = y;
    x = $('#width').val();
    y = $('#height').val();
    if(x < 10 || x > 50 || y < 10 || y > 50) {
      $('.create').html('Invalid!');
      x = oldX;
      y = oldY;
    }
    else {
      $('.table').empty();
      $('.table').hide();
      $('.tile').css('pointer-events', 'all');
      $('.create').html('Create Game');

      numBombs = Math.floor(x * y * 15 / 100);
      tiles = [];
      bombs = [];
      neighbours = [];
      pressed = [];
      flags = [];
      spawned = false;

      for(var i = 0; i < x; i++) {
        tiles[i] = new Array(y);
        bombs[i] = new Array(y);
        neighbours[i] = new Array(y);
        pressed[i] = new Array(y);
        flags[i] = new Array(y);
      }

      for(var i = 0; i < x; i ++) {
        for(var j = 0; j < y; j ++) {
          bombs[i][j] = false;
          pressed[i][j] = false;
          flags[i][j] = false;
          neighbours[i][j] = 0;
        }
      }

      $('.table').css('width', x * 30 + 'px');
      $('.table').css('height', y * 30 + 'px');


      for(var j = 0; j < y; j ++) {
        for(var i = 0; i < x; i ++) {
          tiles[i][j] = $('<div class="tile"></div>');
          $('.table').append(tiles[i][j]);
        }
      }

      $('.table').slideDown();





      $('.tile').mousedown(function(e) {
        find:
        for(var i = 0; i < x; i ++) {
          for(var j = 0; j < y; j ++) {
            if($(this).is(tiles[i][j])) {

              if(e.which === 1 && pressed[i][j]) {
                var numFlags = 0;
                for(var m = i - 1; m <= i + 1 && m < x; m ++) {
                  for(var n = j - 1; n <= j + 1 && n < y; n ++) {
                    if(m >= 0 && n >= 0 && flags[m][n]) {
                      numFlags ++;
                    }
                  }
                }

                if(numFlags === neighbours[i][j]) {
                  for(var m = i - 1; m <= i + 1 && m < x; m ++) {
                    for(var n = j - 1; n <= j + 1 && n < y; n ++) {
                      if(m >= 0 && n >= 0 && !flags[m][n] && !pressed[m][n]) {
                        if(bombs[m][n]) {
                          $('.tile').css('pointer-events', 'none');
                          $('.create').html('You lost...');
                          for(var k = 0; k < x; k ++) {
                            for(var l = 0; l < y; l ++) {
                              if(bombs[k][l] && !flags[k][l]) {
                                $(tiles[k][l]).css('background-color', 'red');
                                $(tiles[k][l]).append('<img src=../../static/game/assets/bomb.jpg>');
                              }
                            }
                          }
                        }
                        else {
                          clear(m, n);
                        }
                      }
                    }
                  }
                }
              }

              if(e.which === 1 && !flags[i][j] && !pressed[i][j]) {
                if(!spawned) {
                  spawn(i, j);
                }
                if(bombs[i][j]) {
                  $('.tile').css('pointer-events', 'none');
                  $('.create').html('You lost...');
                  for(var k = 0; k < x; k ++) {
                    for(var l = 0; l < y; l ++) {
                      if(bombs[k][l] && !flags[k][l]) {
                        $(tiles[k][l]).css('background-color', 'red');
                        $(tiles[k][l]).append('<img src=../../static/game/assets/bomb.jpg>');
                      }
                    }
                  }
                  // $.ajax({
                  //   type: "POST",
                  //   url: "/game/",
                  //   data: {'laba': 'lmao'},
                  //   dataType: "json",
                  //   contentType: "application/json",
                  //   success: function() {
                  //     $('button').html('You lost...');
                  //   },
                  //   error : function(xhr,errmsg,err) {
                  //     $('button').html(err);
                  //   }
                  // });
                }
                else {
                  clear(i, j);
                }
              }

              if(e.which === 3 && !pressed[i][j]) {
                if(!flags[i][j]) {
                  $(tiles[i][j]).append('<img src="../../static/game/assets/flag.jpg">');
                  flags[i][j] = true;
                }
                else {
                  $(tiles[i][j]).empty();
                  flags[i][j] = false;
                }

                end:
                for(var k = 0; k < x; k ++) {
                  for(var l = 0; l < y; l ++) {
                    if(flags[k][l] !== bombs[k][l]) {
                      break end;
                    }
                    if(k === x - 1 && l === y - 1) {
                      $('.create').html('YOU WIN!');
                      $('.tile').css('pointer-events', 'none');
                    }
                  }
                }
              }

              break find;
            }
          }
        }
      })
    }
  })



  $('body').on('contextmenu', '.table', function(e){ return false; });
});
