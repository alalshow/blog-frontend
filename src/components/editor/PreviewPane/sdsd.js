/**
* B2B 상황감시 > B2B 장비별 호계측 현황
*/

parent.window.oncontextmenu = function () {
    return false;
};

window.oncontextmenu = function () {
    return false;
};

$a.page(function() {
  
  var Pv_param;
  var Pv_grid;
  var ckEquipData = {};
  var arrList = [];	//애니메이션 설정 값
  var Pv_perfMap = {
      "A" : {name : "RTT", value: ["RTT_UP"]},
      "M" : {name : "M", value: ["MOS_UP", "MOS_DN MOS_UP", "STDEV_MOS_DN", "STDEV_MOS_UP"]},
      "R" : {name : "R", value: ["R_UP", "R_DN MOS_UP", "STDEV_R_DN", "STDEV_R_UP"]}
  } 
  var timeRotate;
  
  this.init = function(id, param) {
      
      //1.페이지 공통 변수 초기화
      Pf_varInit(param);
  
      //2.이벤트 초기화
      Pf_eventInit();
  }
  
  //1.페이지 공통 변수 초기화
  function Pf_varInit(param) {
      Pv_param = param;
      Pv_grid = '#myGrid';
      
      //그리드 초기화
      Pf_gridInit(Pv_grid);
  }

  //2.이벤트 초기화
  function Pf_eventInit() {
      
      //(1)그리드 애니메이션 설정
      Pf_gridGetAni();
      
      //설정팝업
      $("#btnSetting").on("click", function() {
          var callback = function(data) {
              if(!Gf_isEmpty(data)) {
                  //(2)그리드 해더 그룹 조회
                  Pf_gridGetData();
              }
          }
          //호계측 설정 팝업
          Pf_openPopupB2B("/web/jsp/fm/b2b/UI-B2B-FM-P5151.jsp", "QOS호계측 설정", 1000, 530, null, callback, {target:parent, resizable:false});
      });
      
      //정지&시작 버튼
      $("#btnPause").click(function() {
          $(this).toggleClass("imgPlay");
          
          if($(this).hasClass("imgPlay")) {
              $(this).attr("title","실시간 감시를 합니다.");
              Pf_screenRotateStop();
          } else {
              $(this).attr("title","정지 후 해당 데이터를 확인합니다.");
              
          }
      });
      
      //다음 버튼
      $("#btnActionNext").click(function() {
          
          $("#myGrid").hide();
          $("#multi_chart_div").show();
      });
      //이전버튼
      $("#btnActionBack").click(function() {
          
      });
  }
  
  //그리드 초기화
  function Pf_gridInit(grid) {
      $(grid).alopexGrid({
          defaultColumnMapping: {
              sorting: true,
              resizing: true
          },    	
              
          cellSelectable: false,
          rowSelectOption: {
                clickSelect: true
//				, singleSelect: true			//행선택시 단건행 선택 옵션
//				, disableSelectByKey : true 	//행선택시 shift, ctrl key에 의한 다 건 데이터 선택 기능을 막는 옵션
//				, allowSingleUnselect : false 	//클릭을 통해 행선택을 해제 안되도록하는 옵션
          },
          
          pager: false,
          paging: false,
          height: function(gridHTMLElement) {
              return $(gridHTMLElement).parent().height(); 
          },
          
          enableContextMenu:true,
          enableDefaultContextMenu:false,							
          autoColumnIndex: true,
          autoResize: true,
          fitTableWidth: true,
          
          filter: {
              movable: true,
              saveFilterSize: true,
              title: true
          }
      });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      $(grid).alopexGrid('updateOption', {alwaysShowVerticalScrollBar: this.checked});
      $(grid).alopexGrid('updateOption', {alwaysShowHorizontalScrollBar: this.checked});
  }
  
  //시간에 따라 화면 전환
  function Pf_screenRotate(rTime) {
      for(i in arrList) {
          (function(i) {
              timeRotate = setTimeout(function() {
                  var rotateScreen = {};
                  
                  rotateScreen.COMM_CD_VAL_NM	= arrList[i].COMM_CD_VAL_NM; 
                  rotateScreen.DSBD_PANEL_CL_VAL = arrList[i].DSBD_PANEL_CL_VAL;
                  rotateScreen.DSBD_ATTR_ADD_VAL = arrList[i].DSBD_ATTR_ADD_VAL;
                  
                  //(1.2)애니메이션 설정값에 따라 타이틀명 설정
                  Pf_setTitleDate(rotateScreen);
                  
                  if(i == Math.max(arrList.length)-1) {
                      setTimeout(function() {
                          return Pf_screenRotate(rTime);
                      }, rTime * 100);
                  }
              }, i * rTime * 100);
          })(i);
      }
  }
  
  function Pf_screenRotateStop() {
      return clearTimeout(Pf_screenRotate);
  }
  
  //(1.2)애니메이션 설정값에 따라 타이틀명 설정
  function Pf_setTitleDate(param) {
      Pv_curAniSetVal = param.DSBD_PANEL_CL_VAL;
      aniDataCompare(param);
      
      $(".date-title1").text("▶  ");

      if(param.DSBD_PANEL_CL_VAL == "C") {
          $(".date-title2").text(param.COMM_CD_VAL_NM + " : 종합상황표");
          $("#myGrid").show();
          $("#RTT_multi_chart_div").hide();
          $("#M_multi_chart_div").hide();
          $("#R_multi_chart_div").hide();
      } else if(param.DSBD_PANEL_CL_VAL == "A") {
          $(".date-title2").text(param.COMM_CD_VAL_NM + " : RTT");
          $("#myGrid").hide();
          $("#RTT_multi_chart_div").show();
          $("#M_multi_chart_div").hide();
          $("#R_multi_chart_div").hide();
      } else if(param.DSBD_PANEL_CL_VAL == "M") {
          $(".date-title2").text(param.COMM_CD_VAL_NM + " : MOS");
          $("#myGrid").hide();
          $("#RTT_multi_chart_div").hide();
          $("#M_multi_chart_div").show();
          $("#R_multi_chart_div").hide();
      } else if(param.DSBD_PANEL_CL_VAL == "R") {
          $(".date-title2").text(param.COMM_CD_VAL_NM + " : R");
          $("#myGrid").hide();
          $("#RTT_multi_chart_div").hide();
          $("#M_multi_chart_div").hide();
          $("#R_multi_chart_div").show();
      }
  }
  
  //애니메이션 순차적으로 변경 함수
  function aniDataCompare(param) {
      function compare(a,b) {
          if(a.DSBD_ATTR_ADD_VAL < b.DSBD_ATTR_ADD_VAL) {
              return -1;
          } 
          if(a.DSBD_ATTR_ADD_VAL > b.DSBD_ATTR_ADD_VAL) {
              return 1;
          }
          return 0;
      }
      return arrList.sort(compare);
  }
  
  //(1)애니메이션 설정
  function Pf_gridGetAni() {
      var oParam = {
          trId: "skbmi.fm.fmb2bdsbd@PB2BDsbd.pGetB2BQosAniSetting",
          grId: Pv_grid,
          success: function(res) {
              console.log('res :::: ',res);
              if(!Gf_isEmpty(res.body.LIST.records)) {
                  //(1-1)화면전환시간
                  Pf_rotateTime();
                  
                  //(1.1)애니메이션 설정 값
                  Pf_gridAnimation(res);
                  
                  //(1.2)애니메이션 설정값에 따라 타이틀명 설정
//					Pf_setTitleDate(arrList);
                  
                  //(2)그리드 해더 그룹 조회
                  Pf_gridGetData();
              }
          }
      };
      //서버페이징
      Gf_gridGetData_ByPaging(oParam.trId, oParam.grId, oParam);
  }
  //(1-1)화면전환시간
  function Pf_rotateTime() {
      
      Gf_ajax({
          trId: "skbmi.fm.fmb2bdsbd@PB2BDsbd.pGetB2BQosRotateTime",
          param: arrList,
          success: function(res) {
              console.log('resChart :::: ', res);
              if(!Gf_isEmpty(res.body.LIST)) {
                  var data = res.body.LIST.records;
                  
                  if(!Gf_isEmpty(data)) {
                      for(var i = 0; i < data.length; i++) {
                          if(data[i].DSBD_ATTR_CL_CD == "C") {	//화면전환시간cd값
                              var rTime = data[i].DSBD_ATTR_ADD_VAL;
                              
                              //시간에 따라 화면 전환
                              Pf_screenRotate(rTime);
                          }
                      }
                  }
              } else {
                  Gf_alert('데이터가 없습니다.');
              }
          }
      });
  }
  
  //(2)그리드 해더 그룹 조회
  function Pf_gridGetData() {
//		console.log('aaaaaaa ::: ', screen);
      var oParam = {
          trId: "skbmi.fm.fmb2bdsbd@PB2BDsbd.pGetB2BQosFieldSaveLst",
          grId: Pv_grid,
          success: function(res) {
              if(!Gf_isEmpty(res.body.LIST.records)) {
                  //(2.1)설정한 컬럼 해더그룹 업데이트
                  Pf_gridHeaderGroup(res);
                  
                  //해더 그룹 업데이트 완료 후, 장비의 호계측 정보 디비에서 가져오기.
                  //(2.2)선택 장비의 정보 그리드에 출력
                  Pf_gridGetEquipData();
              }
          }
      };
      //서버페이징
      Gf_gridGetData_ByPaging(oParam.trId, oParam.grId, oParam);
  }
  
  //(3)차트 조회
  function Pf_ChartGetData() {
      
      Gf_ajax({
          trId: "skbmi.fm.fmb2bdsbd@PB2BDsbd.pGetB2BEquipQosChart",
          param: arrList,
          success: function(res) {
              console.log('resChart :::: ', res);
              if(!Gf_isEmpty(res.body.LIST)) {
                  var chartLst = res.body.LIST.records;

                  //차트 데이터&그리기
                  Pf_initChart(chartLst);
              } else {
                  Gf_alert('데이터가 없습니다.');
              }
          }
      });
  }

  //(2.2)그리드 설정 장비 데이터 조회
  function Pf_gridGetEquipData() {
//		console.log('gridList arrList :::::', arrList);
      var oParam = {
          trId: "skbmi.fm.fmb2bdsbd@PB2BDsbd.pGetB2BEquipQosLst",
          grId: Pv_grid,
          param: arrList,
          success: function(res) {
              console.log('res :::: ', res);
              if(!Gf_isEmpty(res.body.LIST)) {
                  
                  //(2.2-1)선택 장비 데이터 조회
                  Pf_gridGetEquipLstData(res);
                  
                  ckEquipData = res.body.LIST.records; 
                  //(3)차트 조회
                  Pf_ChartGetData();
              } else {
                  var arr = [];
                  $(Pv_grid).alopexGrid('dataSet', arr);
              }
          }
      };
      //서버페이징
      Gf_gridGetData_ByPaging(oParam.trId, oParam.grId, oParam);
  }
  
  //(1.1)애니메이션 설정 값
  function Pf_gridAnimation(param) {
      var aniArr = param.body.LIST.records;
      var maxNum = 0;
      var count = 0;

      for(var i in aniArr) {
          $.each(aniArr[i], function(key, value) {
              var newMap = {};
              
              if(key != 'COMM_CD_VAL_NM') {
                  if((key == 'C') && !Gf_isEmpty(value)) {	//종합상황표
                      count++;
                      maxNum = maxNum > value ? maxNum : value;
                      newMap.COMM_CD_VAL_NM = aniArr[i].COMM_CD_VAL_NM;
                      newMap.DSBD_PANEL_CL_VAL = key;
                      newMap.DSBD_ATTR_ADD_VAL = aniArr[i].C;
                      
                      arrList.push(newMap);
                      
                  } else if((key == 'A') && !Gf_isEmpty(value)) {	//완료율그래프
                      count++;
                      maxNum = maxNum > value ? maxNum : value;
                      newMap.COMM_CD_VAL_NM = aniArr[i].COMM_CD_VAL_NM;
                      newMap.DSBD_PANEL_CL_VAL = key;
                      newMap.DSBD_ATTR_ADD_VAL = aniArr[i].A;
                      
                      arrList.push(newMap);
                      
                  } else if((key == 'M') && !Gf_isEmpty(value)) {	//MOS그래프
                      count++;
                      maxNum = maxNum > value ? maxNum : value;
                      newMap.COMM_CD_VAL_NM = aniArr[i].COMM_CD_VAL_NM;
                      newMap.DSBD_PANEL_CL_VAL = key;
                      newMap.DSBD_ATTR_ADD_VAL = aniArr[i].M;
                      
                      arrList.push(newMap);
                      
                  } else if((key == 'R') && !Gf_isEmpty(value)) {	//R그래프
                      count++;
                      maxNum = maxNum > value ? maxNum : value;
                      newMap.COMM_CD_VAL_NM = aniArr[i].COMM_CD_VAL_NM;
                      newMap.DSBD_PANEL_CL_VAL = key;
                      newMap.DSBD_ATTR_ADD_VAL = aniArr[i].R;
                      
                      arrList.push(newMap);
                  }
              }
          });
      }
  }
  
  //(2.1)설정한 컬럼 해더그룹 업데이트
  function Pf_gridHeaderGroup(param) {
      var gridSet = param.body.LIST.records;
      
      var comm = 0;
      var up = 0;
      var down = 0;
      
      var headerNm = {};
      var arr = [{key: "EQUIP_NM",title: "장비명",width: "180px", align: 'left'}];
      var indexArr = [];
      var upMap = [];
      
      for(var i = 0; i < gridSet.length; i++) {
          if(gridSet[i].FIELD_TYPE == 'C') {
              comm++;
          } else if(gridSet[i].FIELD_TYPE == 'U') {
              up++;
              
          } else if(gridSet[i].FIELD_TYPE == 'D') {
              down++;
          }
          
          headerNm = {key: gridSet[i].FIELD_NO+'_'+gridSet[i].FIELD_TYPE, title: gridSet[i].FIELD_NAME, width: "125px"};
          arr.push(headerNm);
      }
      
      //상향 필드가 존재 할 경우
      if(up > 0) {
          indexArr.push({fromIndex: comm+1, toIndex: comm+up, title: '상향'});
      }
      //하향 필드가 존재 할 경우
      if(down > 0) {
          indexArr.push({fromIndex: comm+up+1, toIndex: comm+up+down, title: '하향'});
      }
      
      $(Pv_grid).alopexGrid('updateOption', {columnMapping: arr, headerGroup: indexArr});
  }
  
  //(2.2-1)선택 장비 데이터 조회
  function Pf_gridGetEquipLstData(param) {
      
      var lst = param.body.LIST.records;
      var arr = [];
//		console.log('lst :: ', lst);
      
      for(var i = 0; i < lst.length; i++) {
          arr.push({'EQUIP_NM': lst[i].EQUIP_NM, '1_C': lst[i].CALL_TYPE_NM, '2_C': lst[i].TEST_PATTERN_NM,
              '3_C': lst[i].CALLEE, '4_C': lst[i].ANS_ATT, '5_C': lst[0].RTT_UP,
              '11_U': lst[i].R_UP, '12_U': lst[i].STDEV_R_UP, '13_U': lst[i].MOS_UP, '14_U': lst[i].STDEV_MOS_UP,
              '15_U': lst[i].NOISE_UP, '16_U': lst[i].STDEV_NOISE_UP, '17_U': lst[i].SPEECH_LEVEL_UP,
              '18_U': lst[i].STDEV_SPEECH_LEVEL_UP,'29_U': lst[i].DELAY_UP, '30_U': lst[i].STDEV_DELAY_UP,
              '21_D': lst[i].R_DN, '22_D': lst[i].STDEV_R_DN, '23_D': lst[i].MOS_DN,
              '24_D': lst[i].STDEV_MOS_DN, '25_D': lst[i].NOISE_DN, '26_D': lst[i].STDEV_NOISE_DN,
              '27_D': lst[i].SPEECH_LEVEL_DN, '28_D': lst[i].STDEV_SPEECH_LEVEL_DN,
              '31_D': lst[i].DELAY_DN, '32_D': lst[i].STDEV_DELAY_DN});
      }
      $(Pv_grid).alopexGrid('dataSet', arr);
  }
  
  //차트 데이터&그리기
  function Pf_initChart(chartLst) {
var chartArray = [];
var data = chartLst; //차트데이터
var equipData = ckEquipData; //장비리스트

$.each(equipData, function(equipIdx, equip) {
    var chartObj = {};
    var chartData = data[equip.MO_NO];
    chartObj.title = equip.EQUIP_NM;
    $.each(Pv_perfMap, function(perfMapIdx, perfMapItem) {
        var addSeries = [];
        var name = perfMapItem.name;
        $.each(perfMapItem.value, function(perfItem) {
            var newData = [];
            $.each(chartData, function(chartD) {
                newData.push({
                    x: Pf_getClientTime(chartD.HSTIME_PERF),
                    y: parseInt(chartD[perfItem])
                });
            });
            Pf_arrAscSort(newData, 'x');
            addSeries.push({
                "name": perfItem, 
                "data": newData
            });
        });
        chartObj.series = addSeries;
        chartObj.chartName = name + "_multi_chart"+equipIdx;
        chartArray.push(chartObj);
        $("#RTT_multi_chart_div").append("<div id=\""+chartObj.chartName+"\"></div>");	
    });
});
      
      console.log('22222 :: ', chartArray);
      
      $.each(chartArray, function(index, value) {
          //차트 그리기
          console.log('value', value);
          Highcharts.chart(value.chartName, {
              chart: {
                  type: 'areaspline',
                  width: 350,
                  height: 250
              },
              title: {
                  text: value.title
              },
              xAxis: {
                  startOnTick: false,
                  endOnTick: false,
                  type: 'datetime',
                  crosshair: {
                      color: '#7fff00',
                      dashStyle: 'ShortDot',
                      width: 3,
                      zIndex: 9999
                  }
              },
              legend: {
                  enabled: false
              },
              yAxis: {
                  title: false
              },
              tooltip: {
                   crosshairs: [true],
                   shared: true
              },
              plotOptions: {
                  areaspline: {
                      fillOpacity: 0.15,
                      lineWidth: 0.5,
                      turboThreshold : 990000
                  }
              },
              series: value.series,
              plotOptions: {
                  line: {
                      dataLabels: {
                          enabled: true
                      },
                      enableMouseTracking: true,
                      events: {
                          click: function (event) {
                              var idx = event.point.index;
                              if(this.name == "현재") {
                                  Pf_doDetailPopup(Pv_cur[idx]);
                              } else {
                                  Pf_doDetailPopup(Pv_com[idx]);
                              }
                          }
                      }  
                  }
              },
              colors: [
                  "#FF0000",
                  "#ff6f00",
                  "#00c853",
                  "#00b8d4"
              ]
          });
      });
  }
});