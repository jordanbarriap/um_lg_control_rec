/**
 * TODO
 *   Widget
 *     Utilize overlays to display activities (like to be implemented in the main interface)
 *     Grant immediate (i.e., in the same window) access to activities
 *       There will not be enough room to show activities but Peter wants it that way
 *     Ask server what to provide back
 *   
 *   Timeline
 *     Make the name row hideable
 *   
 *   Adding overlay
 *     Make topic clickable and they go to the activities grids [done]
 *     Topic grids
 *       Click on questions cell shows only questions overlay [done]
 *       Click on average cell shows all activities overlay [done]
 *     Do not show cells for topics with no activities [todo]
 *     On questions grid (i.e., resource-focus mode)
 *       Show overlays as a grid with the color scheme of the row clicked (me, mevsgrp, grp) [done]
 *     Overlay itself
 *       Same grid as the topic one but smaller cells if possible (names of activites on the top) [done]
 *     TODO
 *       Redraw the overlay upon closing the activity window
 *       Hide the overlay when the user "clicks away"
 *       Add a small bar chart for activities (that would require new design because currently there is only one bar chart SVG to which every grid refers to)
 *       Highlight the entire column for which activities are being shown to make it clear to users what they are looking at
 *         Cell shadow could be good and natural here since the overlay has a shadow as well
 *       Experiment with using color to bind the overlay to the activity window (currently, orange #faa200 is used in that window, but only when recommended activities are shown, i.e., after a studnet's fuck up)
 *   Sort others by the resource upon selecting it
 *   
 *   Make students choice of if they are anonymous
 *   Add help
 *   Bar chart is too far to the right for grids with column names. See if this can easily be changed.
 * 
 * URLs
 *    1 : http://adapt2.sis.pitt.edu/um-vis-dev/index.html?usr=yam14&grp=IS172013Fall&sid=test&cid=1&ui-tbar-mode-vis=0&ui-tbar-rep-lvl-vis=0&ui-tbar-topic-size-vis=0
 *   16 : http://adapt2.sis.pitt.edu/um-vis-dev/index.html?usr=lmo17&grp=IS172013Fall&sid=test&cid=1&ui-tbar-mode-vis=0&ui-tbar-rep-lvl-vis=0&ui-tbar-topic-size-vis=0
 */

var qs = $getQS();  // query string parsed into key-value pairs

 var CONST = {
  appName    : "MasteryGrids",
  cookies    : { days: 355 },
  defTopN    : -1,  // the default 'n' in the "Top n" group - Modified by @Jordan for Sergey's study
  log        : { sep01: ",", sep02: ":" },  // separators used for logging
  msg        : {
    actLoadRec_notFound: t('error.actLoadRec_notFound')
  },
  scrollTime : 500,  // after how much time log scrolling position [ms]
  vis        : {
    barAbsL          : { w:600, h:160, padding: { l:35, r: 1, t:4, b: 4 }, bar:    {        padding:1 },          sepX: 20, scales: { y: [0,1]    }, axes: { y: { ticks:3, tickValues: [0.00, 0.50, 1.00],               refLines: [0.25, 0.50, 0.75] } } },
    barAbsS          : { w:600, h: 40, padding: { l:35, r: 1, t:1, b: 1 }, bar:    {        padding:1 },          sepX: 20, scales: { y: [0,1]    }, axes: { y: { ticks:2, tickValues: []                ,               refLines: []                 } } },
    barDevL          : { w:600, h:160, padding: { l:35, r: 1, t:4, b: 4 }, bar:    {        padding:1 },          sepX: 20, scales: { y: [-1,1]   }, axes: { y: { ticks:5, tickValues: [-1.00, -0.50, 0.00, 0.50, 1.00], refLines: [-0.50, 0.50]      } } },
    
    barAbsMini       : { w:300, h:100, padding: { l: 1, r:35, t:4, b: 4 }, bar:    {        padding:1 },          sepX: 10, scales: { y: [0,1]    }, axes: { y: { ticks:3, tickValues: [0.00, 0.50, 1.00],               refLines: [0.25, 0.50, 0.75] } } },
    barDevMini       : { w:300, h:100, padding: { l: 1, r:35, t:4, b: 4 }, bar:    {        padding:1 },          sepX: 10, scales: { y: [-1,1]   }, axes: { y: { ticks:5, tickValues: [-1.00, -0.50, 0.00, 0.50, 1.00], refLines: [-0.50, 0.50]      } } },
    
    bubbleAbsL       : { w:600, h:160, padding: { l:35, r: 1, t:4, b: 4 }, bubble: {        padding:6, rMax:10 }, sepX: 20, scales: { y: [0,1]    }, axes: { y: { ticks:3, tickValues: [0.00, 0.50, 1.00],               refLines: [0.25, 0.50, 0.75] } } },
    bubbleAbsS       : { w:600, h: 40, padding: { l:35, r: 1, t:1, b: 1 }, bubble: {        padding:6, rMax:10 }, sepX: 20, scales: { y: [0,1]    }, axes: { y: { ticks:2, tickValues: []                ,               refLines: []                 } } },
    bubbleDevL       : { w:600, h:160, padding: { l:35, r: 1, t:4, b: 4 }, bubble: {        padding:6, rMax:10 }, sepX: 20, scales: { y: [-1,0,1] }, axes: { y: { ticks:5, tickValues: [-1.00, -0.50, 0.00, 0.50, 1.00], refLines: [-0.50, 0.50]      } } },
    
    gridAbs          : { w:600,        padding: { l:35, r:10, t:1, b:10 }, sq:     { w: 30, padding:1 },          sepX: 15, scales: { y: [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]                                     } },
    gridDev          : { w:600,        padding: { l:35, r:10, t:1, b:10 }, sq:     { w: 30, padding:1 },          sepX: 15, scales: { y: [-1.0, -0.8, -0.6, -0.5, -0.4, -0.2, 0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0] } },
    
    gridAbsAct       : { w:600,        padding: { l:35, r:10, t:1, b:10 }, sq:     { w: 26, padding:1 },          sepX: 15, scales: { y: [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]                                     } },
    gridDevAct       : { w:600,        padding: { l:35, r:10, t:1, b:10 }, sq:     { w: 26, padding:1 },          sepX: 15, scales: { y: [-1.0, -0.8, -0.6, -0.5, -0.4, -0.2, 0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0] } },
   
	
    actWindow        : { w:800, h:420},
    
    otherIndCellH    : { def: 12, min: 2, max: 20 },  // [px]
    minCellSizeRatio : 0.25,
    mode             : { grp: 0, ind: 1 },
    seqStars         : true,
    colors             : {
        // me               : colorbrewer.PuRd,  
        me               : colorbrewer.Greens,
        me_alternative   : colorbrewer.PuRd,
        grp              : colorbrewer.Blues,
        //grp              : colorbrewer.OrRd,
//        rev              : [],
//        grpRev           : [],
//        spectralRev      : [],
        spectral         : colorbrewer.Spectral,
        indiv            : colorbrewer.Greys,
        sequencing       : colorbrewer.OrRd[6][5]
        
    }
  },
  comparison         : { grpActive : true, meGrpActive : true, othersActive : true},

  uriServer  : "http://adapt2.sis.pitt.edu/aggregate2/"
  // uriServer  : "http://localhost:8080/aggregate2/"
};

//@@@Jordan@@@
//Variable needed for solving bug in pcrs content loading
//var pcrs_counter=0;

var state = {
  args   : {},  // set in the loadData_cb() function
  curr   : { usr: "", grp: "", sid: "", cid: "" },
  sequencedActs : [],
  vis : {
    act              : {
      act        : null,
      resId      : null,
      actIdx     : -1,
      rsp        : { result: -1, rec: null, fb: null },  // server's response to the activity outcome
      recIdx     : -1,  // the index of the currently selected recommended activity (in the 'state.vis.act.rsp.recomm' array)
      doUpdState : false,
      isResizing : false
    },
    grid             : {
      cellIdxMax   : 0,
      cellIdxSel   : -1,
      cellSel      : null,
      cornerRadius : 4,
      name         : null,  // the name of the last clicked grid
      xLblAngle    : 45
    },
    isDefBubbleClip  : false,
    isMouseBtn1      : false,
    mode             : CONST.vis.mode.grp,
    otherIndCellH    : 12,  // [px]
    resIdx           : -2,  // there are two entries in the combo box before the first actual resource
    topicIdx         : -1,  // selected topic index
    topicSize        : {
      idx  : 0,
      attr : ""
    },
    lastCellSel      : {
        cellIdxSel   : -1,
        cellSel      : null,
        topicIdx     : -1,
        gridName     : null,
        doMe         : false,
        doVs         : false,
        doGrp        : false
    }
  }
};

var ui = {
  vis : {
    act         : { cont: null, title: null, frame: null, frameRec: null, recLst: null, recLstSel: null, fbDiffCont: null, fbDiffTxt: null, fbDiffBtns: [null, null, null], fbRecCont: null, fbRecTxt: null, fbRecBtns: [null, null, null] },
    grid        : {
      cont   : { me: null, grp: null, others: null },
      me     : { tbar: { sortBy: null, sortDir: null, sortByIdx: 0, sortDirIdx: 0 } },
      grp    : { tbar: {} },
      others : { tbar: { sortBy: null, sortDir: null, sortByIdx: 0, sortDirIdx: 0 } }
    },
    scrollTimer : null,
    svgCommon   : null,
    sunburst    : null,
    actLst      : { cont: null, topicCellX: [] },
    helpDlg     : { title: null, cont: null }
  }
};

var othersTitle = t('title.others');
var groupTitle = t('title.group')

var data = null;  // the data requested from the server



// ------------------------------------------------------------------------------------------------------
/**
 * This is the object which should cummulate functions which can be called from other Web apps and Web
 * pages like activities launched either in separate windows or iframes.
 */
var vis = {
  actDone: function (res) {
    var uri = CONST.uriServer + "GetContentLevels?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&mod=user&sid=" + state.curr.sid + "&lastActivityId=" + state.vis.act.act.id + "&res=" + res+ "&updatesm=true&computeGroupLevels=true&removeZeroProgressUsers=" + state.args.removeZeroProgressUsers;
    $call("GET", uri, null, actDone_cb, true, false);
  },
  
  actUpdState: function (isImmediate) {
    if (isImmediate) {
      // TODO
    }
    else state.vis.act.doUpdState = true;
  },
  
  actLoad: function () {
    $hide(ui.vis.act.fbDiffCont);
    $hide(ui.vis.act.fbRecCont);
    ui.vis.act.fbRecTxt.innerHTML = "";
    
    log(
      "action"               + CONST.log.sep02 + "activity-reload"   + CONST.log.sep01 +
      "activity-topic-id"    + CONST.log.sep02 + getTopic().id       + CONST.log.sep01 +
      "activity-resource-id" + CONST.log.sep02 + state.vis.act.resId + CONST.log.sep01 +
      "activity-id"          + CONST.log.sep02 + getAct().id,
      true, true
    );
  },
  
  actSubmit: function () {
    $clsAdd(document.body, "loading");
  },
  
  loadingHide: function () {
    $clsRem(document.body, "loading");
  },
  
  loadingShow: function () {
    $clsAdd(document.body, "loading");
  }
};


// ------------------------------------------------------------------------------------------------------
/**
 * Closes an activity which has been opened before.
 */
function actClose() {
  log(
    "action"               + CONST.log.sep02 + "activity-close"    + CONST.log.sep01 +
    "activity-topic-id"    + CONST.log.sep02 + getTopic().id       + CONST.log.sep01 +
    "activity-resource-id" + CONST.log.sep02 + state.vis.act.resId + CONST.log.sep01 +
    "activity-id"          + CONST.log.sep02 + getAct().id,
    true
  );
  
  if (state.vis.act.actIdx === -1) return;
  
  ui.vis.act.frame.src = "empty.html";
  
  // (1) Hide the window:
  $hide(ui.vis.act.cont);
  
  $hide(ui.vis.act.recLst);
  $hide(ui.vis.act.fbRecCont);
  $hide(ui.vis.act.frameRec);
  $show(ui.vis.act.frame);
  
  if (ui.vis.act.recLstSel !== null) $clsRem(ui.vis.act.recLstSel, "sel");
  ui.vis.act.recLstSel = null;
  
  ui.vis.act.frame    .src = "empty.html";
  ui.vis.act.frameRec .src = "empty.html";
  
  // (2) Deselect the activity's grid cell:
  var box = state.vis.grid.cellSel.select(".grid-cell-inner").selectAll(".box");
  box.
    transition().delay(0).duration(100).ease("easeInOutQuart").
    attr("rx", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
    attr("ry", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
    attr("filter", "").
    style("stroke", "");
  
  state.vis.grid.cellIdxSel = -1;
  state.vis.grid.cellSel    = null;
  
  // (3) Update the activity grids:
  var res = getRes(state.vis.act.resId);
  if (res.updateStateOn && (res.updateStateOn.winClose || (res.updateStateOn.winCloseIfAct && state.vis.act.doUpdState))) {
//    vis.loadingShow();
    
    actUpdGrids(true, function () { 
        //vis.loadingHide(); 
    });
  }
  else if (state.vis.act.recIdx >= 0) {
    var res = getRes(state.vis.act.rsp.rec[state.vis.act.recIdx].resourceId);
    if (res.updateStateOn && (res.updateStateOn.winClose || (res.updateStateOn.winCloseIfAct && state.vis.act.doUpdState))) {
//      vis.loadingShow();
      actUpdGrids(true, function () { 
        //vis.loadingHide(); 
      });
    }
  }
  
  // (4) Other:
  state.vis.act.act        = null;
  state.vis.act.resId      = null;
  state.vis.act.actIdx     = -1;
  state.vis.act.recIdx     = -1;
  state.vis.act.doUpdState = false;
}


// ------------------------------------------------------------------------------------------------------
/**
 * TODO: Optimize by only updading the "Me" and "Me versus group" grids.  At this point these grids are 
 * being redrawn which is no big deal since no other grids are redrawn.  Consequently, this todo is of 
 * small priority as it wouldn't improve the performance by much (not even sure if it'd be noticeable).
 */
function actDone_cb(rsp) {
  state.vis.act.rsp.result = rsp.lastActivityRes;
  state.vis.act.rsp.rec    = rsp.recommendation;
  state.vis.act.rsp.fb     = rsp.feedback;
  
  log(
    "action"               + CONST.log.sep02 + "activity-done"          + CONST.log.sep01 +
    "activity-topic-id"    + CONST.log.sep02 + getTopic().id            + CONST.log.sep01 +
    "activity-resource-id" + CONST.log.sep02 + state.vis.act.resId      + CONST.log.sep01 +
    "activity-id"          + CONST.log.sep02 + (getAct() ? getAct().id : 'undefined')   + CONST.log.sep01 +
    "activity-result"      + CONST.log.sep02 + state.vis.act.rsp.result,
    true, true
  );
  
  // (1) Update the learner:
  data.learners[getMe(true)] = rsp.learner;
  
  var me = getMe(false);
  visAugmentData_addAvgTopic ([me]);
  visAugmentData_addAvgRes   ([me]);
  
  // (2) Recommended activities:
  // (2.1) Remove the previous recommendations:
  while (ui.vis.act.recLst.children.length > 2) ui.vis.act.recLst.removeChild(ui.vis.act.recLst.children[2]);
  
  // (2.2) At least one activity has been recommended:
  if (rsp.recommendation && rsp.recommendation.length > 0) {
    
    $show(ui.vis.act.recLst);
    
    $clsAdd(ui.vis.act.recLst.children[0], "sel");
    ui.vis.act.recLstSel = ui.vis.act.recLst.children[0];
    
    for (var i=0, ni=rsp.recommendation.length; i < ni; i++) {
      var rec = rsp.recommendation[i];
      
      var topic = null;
      for (var j=0, nj=data.topics.length; j < nj; j++) { if (data.topics[j].id === rec.topicId) topic = function (j) { return data.topics[j]; }(j); }
      if (topic === null) continue;
      
      var act = null;
      for (var j=0, nj=topic.activities[rec.resourceId].length; j < nj; j++) { if (topic.activities[rec.resourceId][j].id === rec.activityId) act = function (j) { return topic.activities[rec.resourceId][j]; }(j); }
      if (act === null) continue;
      
      var div = $$("div", ui.vis.act.recLst);
      var scaleMe =  // TODO: Make this scale thing more general.
        d3.scale.linear().
        domain(CONST.vis.gridAbs.scales.y).
        range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
      $$("span", div, null, "grid-cell", "&nbsp;&nbsp;&nbsp;&nbsp;").style.backgroundColor = scaleMe(getMe().state.activities[rec.topicId][rec.resourceId][rec.activityId].values[getRepLvl().id]);
      $$("span", div, null, null, "2." + (i+1) + ". " + act.name);
      div.onclick = function (i) {
        return function (e) {
          
          if (ui.vis.act.recLstSel !== null) $clsRem(ui.vis.act.recLstSel, "sel");
          
          var div = $evtTgt(e);
          if (div.nodeName.toLowerCase() !== "div") div = div.parentNode;  // in case a nested span element has been clicked
          $clsAdd(div, "sel");
          ui.vis.act.recLstSel = div;
          
          actLoadRec(i);
        };
      }(i);
    }
  }
  
  // (2.3) Nothing has been recommended:
  else {
    $hide(ui.vis.act.recLst);
    $hide(ui.vis.act.fbRecCont);
  }
  
  // (3) Activity feedback:
  if (state.vis.act.rsp.result === 1 && state.vis.act.rsp.fb && state.vis.act.rsp.fb.id) {
    $show(ui.vis.act.fbDiffCont);
    ui.vis.act.fbDiffBtns[0].prop("checked", false).button("refresh");
    ui.vis.act.fbDiffBtns[1].prop("checked", false).button("refresh");
    ui.vis.act.fbDiffBtns[2].prop("checked", false).button("refresh");
  }
  else {
    $hide(ui.vis.act.fbDiffCont);
  }
  
  // (4) Update the activity grids:
  var res = getRes(state.vis.act.resId);
  if (res.updateStateOn && res.updateStateOn.done) {
      actUpdGrids(false, null);
  }
  
  // (5) Other:
  vis.loadingHide();
}


// ------------------------------------------------------------------------------------------------------
function actFbDiff(val) {
  var uri = CONST.uriServer + "StoreFeedback?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&srcActivityId=" + state.vis.act.act.id + "&srcActivityRes=1&feedbackId=" + state.vis.act.rsp.fb.id + "&feedbackItemsIds=ques_difficulty&responses=" + val + "&recommendationId=";
  $call("GET", uri, null, null, true, false);
  
  log(
    "action"                  + CONST.log.sep02 + "activity-feedback-set-difficulty" + CONST.log.sep01 +
    "activity-topic-id"       + CONST.log.sep02 + getTopic().id                      + CONST.log.sep01 +
    "activity-resource-id"    + CONST.log.sep02 + state.vis.act.resId                + CONST.log.sep01 +
    "activity-id"             + CONST.log.sep02 + getAct().id                        + CONST.log.sep01 +
    "feedback-id"             + CONST.log.sep02 + state.vis.act.rsp.fb.id            + CONST.log.sep01 +
    "feedback"                + CONST.log.sep02 + val,
    true
  );
}


// ------------------------------------------------------------------------------------------------------
function actFbRec(val) {
  var rec = getRec();
  if (!rec._rt) rec._rt = {};
  rec._rt.fb = val;
  
  var uri = CONST.uriServer + "StoreFeedback?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&srcActivityId=" + state.vis.act.act.id + "&srcActivityRes=" + state.vis.act.rsp.result + "&feedbackId=&feedbackItemsIds=&responses=" + val + "&recommendationId=" + getRec().recommendationId;
  $call("GET", uri, null, null, true, false);
  
  log(
    "action"                           + CONST.log.sep02 + "activity-recommended-feedback-set" + CONST.log.sep01 +
    "activity-original-topic-id"       + CONST.log.sep02 + getTopic().id                       + CONST.log.sep01 +
    "activity-original-resource-id"    + CONST.log.sep02 + state.vis.act.resId                 + CONST.log.sep01 +
    "activity-original-id"             + CONST.log.sep02 + getAct().id                         + CONST.log.sep01 +
    "activity-recommended-topic-id"    + CONST.log.sep02 + rec.topicId                         + CONST.log.sep01 +
    "activity-recommended-resource-id" + CONST.log.sep02 + rec.resourceId                      + CONST.log.sep01 +
    "activity-recommended-id"          + CONST.log.sep02 + rec.activityId                      + CONST.log.sep01 +
    "recommendation-id"                + CONST.log.sep02 + rec.recommendationId                + CONST.log.sep01 +
    "recommendation-rank"              + CONST.log.sep02 + rec.rank                            + CONST.log.sep01 +
    "recommendation-score"             + CONST.log.sep02 + rec.score                           + CONST.log.sep01 +
    "feedback"                         + CONST.log.sep02 + val,
    true
  );
}


// ------------------------------------------------------------------------------------------------------
/**
 * Loads one of the recommended activities.
 */
function actLoadRec(idx) {
  if (state.vis.act.recIdx === idx) return;
  
  // (1) Update the activity grids:
  if (state.vis.act.recIdx >= 0) {
    var res = getRes(state.vis.act.rsp.rec[state.vis.act.recIdx].resourceId);
    if (res.updateStateOn && (res.updateStateOn.winClose || (res.updateStateOn.winCloseIfAct && state.vis.act.doUpdState))) {
      vis.loadingShow();
      actUpdGrids(true, function () { vis.loadingHide(); });
    }
  }
  
  // (2) Identify topic and acticity:
  state.vis.act.recIdx = idx;
  
  var rec = getRec();
  
  var topic = null;
  for (var j=0, nj=data.topics.length; j < nj; j++) { if (data.topics[j].id === rec.topicId) topic = function (j) { return data.topics[j]; }(j); }
  if (topic === null) return alert(CONST.msg.actLoadRec_notFound);
  
  var act = null;
  for (var j=0, nj=topic.activities[rec.resourceId].length; j < nj; j++) { if (topic.activities[rec.resourceId][j].id === rec.activityId) act = function (j) { return topic.activities[rec.resourceId][j]; }(j); }
  if (act === null) return alert(CONST.msg.actLoadRec_notFound);
  
  // (3) Manage frames:
  // @@@@ Julio:  
  var res = getRes(rec.resourceId);
  ui.vis.act.frameRec.style.width = ui.vis.act.frame.style.width;
  ui.vis.act.frameRec.style.height = ui.vis.act.frame.style.height;
//  if(res.dim){
//      //if(res.dim.w) ui.vis.act.frameRec.style.width = res.dim.w + "px";
//      //if(res.dim.h) ui.vis.act.frameRec.style.height = res.dim.h + "px";
//      //ui.vis.act.table.style.width = (res.dim.w) + "px";
//      //ui.vis.act.table.style.height = (res.dim.h) + "px";
//  }  
  
  $hide(ui.vis.act.frame);
  $show(ui.vis.act.frameRec);
  
  ui.vis.act.frameRec.src = act.url + "&grp=" + state.curr.grp + "&usr=" + state.curr.usr + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid;
  
  // (4) Manage feedback:
  if (rec.feedback && rec.feedback.text && rec.feedback.text.length > 0) {
    var actName = getActRec().name;
    ui.vis.act.fbRecTxt.innerHTML = rec.feedback.text.replace(actName, "2." + (idx+1) + ". " + actName);
    $show(ui.vis.act.fbRecCont);
  }
  else {
    $hide(ui.vis.act.fbRecCont);
    ui.vis.act.fbRecTxt.innerHTML = "";
  }
  
  ui.vis.act.fbRecBtns[0].prop("checked", (!rec._rt || rec._rt.fb !== 0 ? false : true)).button("refresh");
  ui.vis.act.fbRecBtns[1].prop("checked", (!rec._rt || rec._rt.fb !== 1 ? false : true)).button("refresh");
  ui.vis.act.fbRecBtns[2].prop("checked", (!rec._rt || rec._rt.fb !== 2 ? false : true)).button("refresh");
  
  // (3) Manage recommended activities:
  var scaleMe =  // TODO: Make this scale thing more general.
    d3.scale.linear().
    domain(CONST.vis.gridAbs.scales.y).
    range(["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]));
  
  for (var i=0, ni=state.vis.act.rsp.rec.length; i < ni; i++) {
    var recTmp = state.vis.act.rsp.rec[i];
    var spanCell = ui.vis.act.recLst.children[i+2].children[0];  // +2 to skip to the recommended activities
    spanCell.style.backgroundColor = scaleMe(getMe().state.activities[recTmp.topicId][recTmp.resourceId][recTmp.activityId].values[getRepLvl().id]);
  }
  
  /*
  var div = $$("div", ui.vis.act.recLst)
  var scaleMe =
    d3.scale.linear().
    domain(CONST.vis.gridAbs.scales.y).
    range(["#eeeeee"].concat(colorbrewer.PuRd[data.vis.color.binCount - 1]));
  $$("span", div, null, "grid-cell", "&nbsp;&nbsp;&nbsp;&nbsp;").style.backgroundColor = scaleMe(getMe().state.activities[rec.topicId][rec.resourceId][rec.activityId].values[getRepLvl().id]);
  $$("span", div, null, null, "2." + (i+1) + ". " + act.name);
  div.onclick = function (i) {
    return function (e) {
      if (ui.vis.act.recLstSel !== null) $clsRem(ui.vis.act.recLstSel, "sel");
      
      var div = $evtTgt(e);
      if (div.nodeName.toLowerCase() !== "div") div = div.parentNode;  // in case a nested span element has been clicked
      $clsAdd(div, "sel");
      ui.vis.act.recLstSel = div;
      
      actLoadRec(i);
    };
  };
  */
  
  // (6) Log:
  log(
    "action"                           + CONST.log.sep02 + "activity-load-recommended" + CONST.log.sep01 +
    "activity-original-topic-id"       + CONST.log.sep02 + getTopic().id               + CONST.log.sep01 +
    "activity-original-resource-id"    + CONST.log.sep02 + state.vis.act.resId         + CONST.log.sep01 +
    "activity-original-id"             + CONST.log.sep02 + getAct().id                 + CONST.log.sep01 +
    "activity-recommended-topic-id"    + CONST.log.sep02 + rec.topicId                 + CONST.log.sep01 +
    "activity-recommended-resource-id" + CONST.log.sep02 + rec.resourceId              + CONST.log.sep01 +
    "activity-recommended-id"          + CONST.log.sep02 + rec.activityId              + CONST.log.sep01 +
    "recommendation-id"                + CONST.log.sep02 + rec.recommendationId        + CONST.log.sep01 +
    "recommendation-rank"              + CONST.log.sep02 + rec.rank                    + CONST.log.sep01 +
    "recommendation-score"             + CONST.log.sep02 + rec.score,
    true
  );
}


// ------------------------------------------------------------------------------------------------------
/**
 * Loads the original activity (typically accessed from the recommended-activities side bar).
 */
function actLoadRecOriginal() {
  if (state.vis.act.recIdx === -1) return;
  
  // (1) Update the activity grids:
//  if (state.vis.act.recIdx >= 0) {
//    var res = getRes(state.vis.act.rsp.rec[state.vis.act.recIdx].resourceId);
//    if (res.updateStateOn && (res.updateStateOn.winClose || (res.updateStateOn.winCloseIfAct && state.vis.act.doUpdState))) {
//      vis.loadingShow();
//      actUpdGrids(true, function () { vis.loadingHide(); });
//    }
//  }
  
  // (2) The rest:
  state.vis.act.recIdx = -1;
  
  if (ui.vis.act.recLstSel !== null) $clsRem(ui.vis.act.recLstSel, "sel");
  
  $clsAdd(ui.vis.act.recLst.children[0], "sel");
  ui.vis.act.recLstSel = ui.vis.act.recLst.children[0];
  
  $hide(ui.vis.act.fbRecCont);
  ui.vis.act.fbRecTxt.innerHTML = "";
  
  $show(ui.vis.act.frame);
  $hide(ui.vis.act.frameRec);
  
  log(
    "action"               + CONST.log.sep02 + "activity-load-original" + CONST.log.sep01 +
    "activity-topic-id"    + CONST.log.sep02 + getTopic().id            + CONST.log.sep01 +
    "activity-resource-id" + CONST.log.sep02 + state.vis.act.resId      + CONST.log.sep01 +
    "activity-id"          + CONST.log.sep02 + getAct().id,
    true
  );
}

/*
 * Shows the help window
 */
function helpDialogShow(origin,x,y){
    $removeChildren(ui.vis.helpDlgTitle);
    if (origin === "") {helpTitle = ""; helpSrc = "";}
    //$$("span", ui.vis.helpDlgTitle, "help-title-text", "", helpTitle);
    $($$input("button", ui.vis.helpDlgTitle, "btn-act-lst-close", "small-btn", t('button.close'))).button().click(helpDialogHide);
    
 
    ui.vis.helpDlg.style.width = "250px";
    ui.vis.helpDlg.style.height = "150px";

    //Added by Jordan for Aalto study (Fall 2018)
    //if(state.curr.cid==365){
      //ui.vis.helpDlg.style.height = "300px";
    //}
    
    //ui.vis.helpDlgCont.innerHTML='<object type="text/html" data="'+helpSrc+'" ></object>';
    ui.vis.helpDlgCont.innerHTML = generateHelp(origin);
    
    $show(ui.vis.helpDlg);
    
    ui.vis.helpDlg.style.left = (x + 5) + "px";
    ui.vis.helpDlg.style.top  = (y + 5) + "px";
    
    
}

function helpDialogHide(){
    $hide(ui.vis.helpDlg);
    if($("#overlay").css("display")!="none"){
      $("#overlay").css("display","none");
    }
}

// ------------------------------------------------------------------------------------------------------
/**
 * Shows the actitivies list (i.e., the overlay).
 * 
 * 'state.vis.topicIdx' should be set before this function is invoked.
 */
function actLstShow(doMe, doVs, doGrp) {

  if(state.args.uiGradualTopicOpening && checkIfTopicUnlocked(state.vis.topicIdx) == false) {
    actLstHide()
    return;
  }

  if(state.args.uiOnlyMeRowActLst) {
    doMe = true
    doVs = false
    doGrp = false
  }
  
  state.vis.lastCellSel.doMe = doMe;
  state.vis.lastCellSel.doVs = doVs;
  state.vis.lastCellSel.doGrp = doGrp;
  state.vis.lastCellSel.cellIdxSel = state.vis.grid.cellIdxSel;
  state.vis.lastCellSel.cellSel = state.vis.grid.cellSel;
  state.vis.lastCellSel.topicIdx = state.vis.grid.topicIdx;
  state.vis.lastCellSel.gridName = state.vis.grid.name;
  
  if (state.vis.topicIdx === 0) actLstHide();  // the "average" topic has been clicked
  $removeChildren(ui.vis.actLst.cont);
  
  var topic     = getTopic();
  var me        = getMe();
  var grp       = getGrp();
  var res       = getRes();
  var resNames  = $map(function (x) { return x.name; }, data.resources.slice(1));
  var title     = "";  // "<span class=\"info\">Activities</span>";
  
  $($$input("button", ui.vis.actLst.cont, "btn-act-lst-close", "small-btn", t('button.close'))).button().click(actLstHide);
  
  // (1) Generate the activities grid:
  // (1.1) All resources:
  if (state.vis.resIdx < 0) {
    switch (state.vis.mode) {
      // (1.1.1) Group comparison mode:
      case CONST.vis.mode.grp:
        if (doMe)  visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_me",        me,           null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);                                                    }, data.resources), true,  false), CONST.vis.gridAbsAct, title, null,                       false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barAbsMini, resNames, true,  false, false, false);
        if (doVs)  visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_mevsgrp", me,           grp,      [],          $map(function (x) { return CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources), false, false), CONST.vis.gridDevAct, title, null,                       false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);
        if (doGrp) visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_grp",       grp,          null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]);                                                   }, data.resources), false, false), CONST.vis.gridAbsAct, title, null,                       false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barAbsMini, resNames, true,  false, false, false);
        break;
      
      // (1.1.1) Individual comparison mode:
      case CONST.vis.mode.ind:
        visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_me",        me,           null,     [t('peer.me')],      $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources), true,  false ), CONST.vis.gridAbsAct, title, null,                       false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barAbsMini, resNames, true,  false, false, false);
        break;
    }
  }  
  // (1.2) One resource:
  else {
    var act        = (topic.activities ? topic.activities[res.id] || [] : []);
    var topicNames = [topic.name].concat($map(function (x) { return x.name; }, act));
    var topicMaxW  = svgGetMaxTextBB(topicNames).width + 10;
    switch (state.vis.mode) {
      // (1.2.1) Group comparison mode:
     
      case CONST.vis.mode.grp:
        // Non-AVG resource-focus (e.g., questions, examples, etc.):
        if (res.id !== "AVG") {
          title = "";
          var seriesNames = [t('peer.me'), t('grid.me_vs_group'), t('grid.group')];
          var colorScales = [
            CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]),
            CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]),
            CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1])
          ];
          if(state.args.uiGridMeGrpVis || state.args.uiGridGrpVis) {
              if (doMe)    visGenGrid(ui.vis.actLst.cont, visGenGridDataOneRes_act(null,     "act_me",          me,           null,     seriesNames,  colorScales,                                                                                                                                                               true,  false), CONST.vis.gridDevAct, title, null,  false, true,   0, state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, true , false);
              if (doVs)    visGenGrid(ui.vis.actLst.cont, visGenGridDataOneRes_act(null,     "act_mevsgrp",   me,           grp,      seriesNames,  colorScales,                                                                                                                                                               true,  false), CONST.vis.gridDevAct, title, null,  false, true,   0, state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, true , false);
              if (doGrp)   visGenGrid(ui.vis.actLst.cont, visGenGridDataOneRes_act(null,     "act_grp",         grp,          null,     seriesNames,  $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]);                                                      }, data.resources), true,  false), CONST.vis.gridAbsAct, title, null,  false, true,   0, state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, true , false);              
          }else{
                           visGenGrid(ui.vis.actLst.cont, visGenGridDataOneRes_act(null,     "act_me",          me,           null,     seriesNames,  colorScales,                                                                                                                                                               true,  false), CONST.vis.gridDevAct, title, null,  false, true,   0, state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, true , false);
          }
        }
        // AVG resource-focus:
        else{
            // @@@@ 
            if(state.args.uiGridMeGrpVis || state.args.uiGridGrpVis) {
//                visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_mevsgrp", me,           null,      [],          $map(function (x) { return CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources), true, false), CONST.vis.gridDevAct, title, null,                       false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);
                if (doMe)  visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_me",          me ,          null,      [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);                                                       }, data.resources), true,  false), CONST.vis.gridAbsAct, title, null,  false, false,  0, state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);
                if (doVs)  visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_mevsgrp",   me ,          grp ,      [],          $map(function (x) { return CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources), false, false), CONST.vis.gridDevAct, title, null,  false, false,  0, state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);
                if (doGrp) visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_grp",         grp,          null,      [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]);                                                      }, data.resources), false, false), CONST.vis.gridAbsAct, title, null,  false, false,  0, state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);

            }
                
            else{
                
                           visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_me",          me,           null,      [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);                                                       }, data.resources), true,  false), CONST.vis.gridAbsAct, title, null,  false, false,  0, state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, false, false);
            }                
        }
        break;
      
      // (1.2.2) Individual comparison mode:
      case CONST.vis.mode.ind:
        // Non-AVG resource-focus (e.g., questions, examples, etc.):
        if (res.id !== "AVG") {
                           visGenGrid(ui.vis.actLst.cont, visGenGridDataOneRes_act(null,     "act_me",          me,           null,     [t('peer.me')],       $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                    }, data.resources), true,  false ), CONST.vis.gridAbsAct, title, null, false, true,   0, state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barDevMini, resNames, true,  false, true , false);
        }
        
        // AVG resource-focus:
        else               visGenGrid(ui.vis.actLst.cont, visGenGridDataAllRes_act(null,     "act_me",          me,           null,     [t('peer.me')],       $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                    }, data.resources), true,  false ), CONST.vis.gridAbsAct, title, null, false, false,  0, state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 0, true,  /*BarChart*/null, CONST.vis.barAbsMini, resNames, true,  false, false, false);
        
        break;
    }
    
    
  }
  
  // (2) Align the list:
  // cell = d3.select("g[data-cell-idx='" + state.vis.grid.cellIdxSel + "']");
  // state.vis.grid.cellSel[0]
  
  var grid = null;
  if (doMe)         grid = ui.vis.grid.cont.me.childNodes[0];
  if (doVs && !res) grid = ui.vis.grid.cont.me.childNodes[1];
  if (doVs &&  res) grid = ui.vis.grid.cont.me.childNodes[0];
  if (doGrp && !res)  grid = ui.vis.grid.cont.grp.childNodes[0];
  if (doGrp && res){
      //if(res.id !== 'AVG') 
          //grid = ui.vis.grid.cont.grp.childNodes[0];
      //else 
      grid = ui.vis.grid.cont.me.childNodes[0];
  }

  if (grid) {
    var y = $getCoords(grid).y2 - (state.args.uiTBarModeGrpChk ? 32 : (state.args.uiShowBarChart ? 62:0)) - (((!res && doMe) || (res && (doMe || doVs || doGrp))) && state.args.uiGridTimelineVis ? (state.vis.mode === CONST.vis.mode.ind && state.vis.resIdx >= 0 ? 25 : 30) : 0);
    
    $setPosCenter(ui.vis.actLst.cont,  false, ui.vis.actLst.topicCellX[state.vis.topicIdx - 1] + $getCoords($("#grids")[0]).x1, y,      true );
    $setPosCenter(ui.vis.actLst.arrow, false, ui.vis.actLst.topicCellX[state.vis.topicIdx - 1] + $getCoords($("#grids")[0]).x1, y - 15, false);
	
	if(data.configprops.agg_reactiverec_enabled) {
		pawswebsocket.ensureSocketIsOpen();
	}
	
	
  }
  
}


// ------------------------------------------------------------------------------------------------------
function actLstHide(event) {
  state.vis.grid.cellIdxSel = -1;
  state.vis.grid.cellSel    = null;
  state.vis.topicIdx        = -1;
  state.vis.grid.name       = null;
//  state.vis.lastCellSel.doMe = false;
//  state.vis.lastCellSel.doVs = false;
//  state.vis.lastCellSel.doGrp = false;
//  state.vis.lastCellSel.cellIdxSel = -1;
//  state.vis.lastCellSel.cellSel = null;
//  state.vis.lastCellSel.topicIdx = -1;
//  state.vis.lastCellSel.gridName = null;
  $hide(ui.vis.actLst.cont);
  $hide(ui.vis.actLst.arrow);
  
  if(event) {
	visDo(true, true, true);  
  }
  
}


// ------------------------------------------------------------------------------------------------------
/**
 * Opens the specified activity.
 * 
 * - http://adapt2.sis.pitt.edu/quizjet/quiz1.jsp?rdfID=jvariables1&act=Variables&sub=jVariables1&app=25&grp=IS172013Spring&usr=peterb&sid=7EA4F
 */
function actOpen(resId, actIdx) {

  var topic = getTopic();
  var act = topic.activities[resId][actIdx];
  var res = getRes(resId);
  
  state.vis.act.act    = act;
  state.vis.act.resId  = resId;
  state.vis.act.actIdx = actIdx;
  
  $hide(ui.vis.act.recLst);
  $hide(ui.vis.act.fbDiffCont);
  $hide(ui.vis.act.fbRecCont);
  $hide(ui.vis.act.frameRec);
  
  
  // TODO
  if(res.dim){
      /*if(res.dim.w) ui.vis.act.frame.style.width = res.dim.w + "px";
      if(res.dim.h) ui.vis.act.frame.style.height = res.dim.h + "px";

      ui.vis.act.table.style.width = (res.dim.w) + "px";
      ui.vis.act.table.style.height = (res.dim.h) + "px";*/
      
      //ui.vis.act.frameRec.style.width = "930px";
      //ui.vis.act.frameRec.style.width = "930px";

      //@@@JORDAN
      //Adaptive frame size
      var display_width = 0.9*Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var display_height = 0.8*Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      ui.vis.act.frame.style.width = display_width + "px";
      ui.vis.act.frame.style.height = display_height + "px";

      ui.vis.act.table.style.width = display_width + "px";
      ui.vis.act.table.style.height = display_height + "px";
      
      //@@@JORDAN
  }else{
      ui.vis.act.frame.style.width = CONST.vis.actWindow.w;
      ui.vis.act.frame.style.height = CONST.vis.actWindow.h;
      
      ui.vis.act.table.style.width  = (CONST.vis.actWindow.w) + "px";
      ui.vis.act.table.style.height = (CONST.vis.actWindow.h) + "px";
  }
  // show the link for help
  var helpLink = "";
  if(resId === 'ae'){
      helpLink = `<a href=\"https://greengoblin.cs.hut.fi/jsvee/help/\" title=\"${t('help.animated_examples_link')}\" target=\"_blank\">${t('help.animated_examples')}</a>`;
  }
  
  $show(ui.vis.act.frame);
  $show(ui.vis.act.cont);
  
  ui.vis.act.title.innerHTML = t('title.topic_activity',{topic: topic.name, activity: act.name})

  var activity_url = act.url

  if(state.curr.grp.startsWith("AALTOSQL21") || state.curr.grp.startsWith("INFSCI2710Fall2021")) {
    var is_dbqa_url = act.url.indexOf("tool=dbqa") !== -1;
    if(is_dbqa_url) {
      activity_url += "&step_explanation=" + state.args.dbqaExplanations
    }
  }
  
  ui.vis.act.frame.src = activity_url + "&grp=" + state.curr.grp + "&usr=" + state.curr.usr + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid;
  ui.vis.act.otherTxt.innerHTML = helpLink;
  

  log(
    "action"               + CONST.log.sep02 + "activity-open"     + CONST.log.sep01 +
    "activity-topic-id"    + CONST.log.sep02 + getTopic().id       + CONST.log.sep01 +
    "activity-resource-id" + CONST.log.sep02 + state.vis.act.resId + CONST.log.sep01 +
    "activity-id"          + CONST.log.sep02 + getAct().id,
    true
  );
  
  // NOTE: Old way by opening an activity in a new tab (useful as an example if more tab-code needs to be developed):
  /*
  // remove all tabs after the second one:
  for (var i = 3; i <= ui.nav.tabs.cnt; i++) {
    ui.nav.tabs.tabs.find(".ui-tabs-nav").find("#nav-tabs-tab-" + i + "-li").remove();
    ui.nav.tabs.tabs.find("#nav-tabs-tab-" + i).remove();
  }
  ui.nav.tabs.tabs.tabs("refresh");
  ui.nav.tabs.cnt = 2;
  
  // add the new tab:
  ui.nav.tabs.tabs.find(".ui-tabs-nav").append($("<li id='nav-tabs-tab-3-li'><a href='#nav-tabs-tab-3'>" + name + "</a></li>"));
  ui.nav.tabs.tabs.append("<div id='nav-tabs-tab-3'></div>");
  ui.nav.tabs.tabs.tabs("refresh");
  ui.nav.tabs.tabs.tabs("option", "active", 2);
  ui.nav.tabs.cnt = 3;
  
  // load the activity:
  var frame = $$("frame", $_("nav-tabs-tab-3"), null, "act");
  frame.src = "http://adapt2.sis.pitt.edu/quizjet/quiz1.jsp?rdfID=jvariables1&act=Variables&sub=jVariables1&app=25&grp=IS172013Spring&usr=peterb&sid=7EA4F";
  */
}


// ------------------------------------------------------------------------------------------------------
/**
 * Updates the activities grid. This function can request the new state or assume the current state 
 * already reflects any changes.
 */
function actUpdGrids(doReqState, fnCb) {
  if (doReqState) {
    var uri = CONST.uriServer + "GetContentLevels?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&mod=user&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&lastActivityId=" + state.vis.act.act.id + "&res=-1&computeGroupLevels=true&removeZeroProgressUsers=" + state.args.removeZeroProgressUsers + (is_report_level_progress()?"":"&updatesm=true");
    //$call("GET", uri, null, function () { actUpdGrids_cb(fnCb); }, true, false);
    $call("GET", uri, null, updateLearnerData, true, false);
  }
  else actUpdGrids_cb(fnCb);
}

function updateLearnerData(rsp){
  if(state.args.practiceGoalSC) {
    const progress_change = calculateProgressChange(rsp);
    updatePracticeProgress(progress_change)
  }

  data.learners[getMe(true)] = rsp.learner;
  data.groups = rsp.groups;

  data.learners = rsp.learners // This should be done only if the computeGroupLevels=true
  visAugmentData_addAvgTopic (data.learners);
  visAugmentData_addAvgRes   (data.learners);
	    
  var me = getMe(false);
  visAugmentData_addAvgTopic ([me]);
  visAugmentData_addAvgRes   ([me]);
	
	visAugmentData_addAvgTopic(rsp.groups);
  visAugmentData_addAvgRes(rsp.groups);

  if(state.args.adaptiveSC) {
    initAdaptiveComparisonGroup()
  } else if(state.args.slidingControlSC) {
    initSlidingComparisonGroup()
  } else if(state.args.practiceGoalSC) {
    initPracticeGoal()
  } else { // If not adaptive and sliding control, visualization should be updated. Update is done for first two cases through grpSet()
    actUpdGrids_cb(function () { vis.loadingHide();}); 
  }
}

function calculateProgressChange(response) {
  const updated_progress = getActivityProgress(response.learner.state, response.lastActivityId);
  const prev_progress = getActivityProgress(data.learners[getMe(true)].state, response.lastActivityId);
  
  return Math.max(0, updated_progress - prev_progress);
}

function getActivityProgress(learnerState, activityId) {
  if (!learnerState || !learnerState.activities || !activityId) {
    console.warn("Invalid learnerState or activityId provided.");
    return 0.0;
  }

  let progress = 0.0;
  const filtered_acts = Object.values(learnerState.activities)
    .flatMap(e => (e ? Object.values(e) : []))
    .filter(e => e && Object.keys(e).includes(activityId));

  if (filtered_acts.length > 0 && filtered_acts[0][activityId]?.values?.p !== undefined) {
    progress = filtered_acts[0][activityId].values.p;
  } else {
    console.warn(`Activity ID ${activityId} not found or missing progress value.`);
  }

  return progress;
}


// ----^----
function actUpdGrids_cb(fnCb) {
  var cellIdxSel = state.vis.grid.cellIdxSel;  // hold (a)

  visDo(true, false, false);
  
  if(ui.vis.actLst.cont.style.display !== 'none'){
      actLstShow(state.vis.lastCellSel.doMe,state.vis.lastCellSel.doVs,state.vis.lastCellSel.doGrp);
  }
  
  // Set the appropriate cell as selected:
  state.vis.grid.cellIdxSel = cellIdxSel;  // fetch (a)
  state.vis.grid.cellSel    = d3.select("g[data-cell-idx='" + state.vis.grid.cellIdxSel + "']");
  
  var box = state.vis.grid.cellSel.select(".grid-cell-inner").selectAll(".box");
  box.
    attr("rx", (!visDoVaryCellW() ? 20 : 0)).
    attr("ry", (!visDoVaryCellW() ? 20 : 0)).
    style("stroke-width", (!visDoVaryCellW() ? 1.51 : 1.51)).
    style("stroke", "black");
  
  if (fnCb) fnCb();
}


// ------------------------------------------------------------------------------------------------------
/**
 * Sets comparison mode (group or individual).
 */
function compModeSet(mode) {
  if (mode === state.vis.mode) return;
  
  state.vis.mode = mode;
  
  if (state.args.uiGridActLstMode) actLstHide();
  
  visDo(true, true, true);
  
  log("action" + CONST.log.sep02 + "comparison-mode-set", true, true);
}

/**
 * Shows or hide comparison and group grids
 */
function comparisonVisible(showGrp, showMeVsGrp, showOthers) {
  if (state.args.uiGridActLstMode) actLstHide();
  state.args.uiGridGrpVis = showGrp;
  state.args.uiGridMeGrpVis = showMeVsGrp;
  state.args.uiGridOthersVis = showOthers;

  visDo(true, true, true);
  
  log("action" + CONST.log.sep02 + "comparison-visible("+(showGrp ? "1" : "0")+","+(showMeVsGrp ? "1" : "0")+","+(showOthers ? "1" : "0")+")", true, true);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the currently selected activity (original, not recommended one).
 */
function getAct() {
  return state.vis.act.act;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the currently selected recommended activity (not the original one).
 */
function getActRec() {
  var rec = getRec();
  if (rec === null) return null;
  
  var topic = null;
  for (var j=0, nj=data.topics.length; j < nj; j++) { if (data.topics[j].id === rec.topicId) topic = function (j) { return data.topics[j]; }(j); }
  if (topic === null) return null;
  
  var act = null;
  for (var j=0, nj=topic.activities[rec.resourceId].length; j < nj; j++) { if (topic.activities[rec.resourceId][j].id === rec.activityId) act = function (j) { return topic.activities[rec.resourceId][j]; }(j); }
  if (act === null) return null;
  
  return act;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the currently selected group object.  Note, that to get learners which make up that group 
 * you use the 'getOthers()' function.
 */
function getGrp() {
  //return data.groups[$_("tbar-grp").selectedIndex];//Comented by @Jordan

  if(state.args.adaptiveSC ||  state.args.slidingControlSC) {
    var comparison_group = data.groups.find(e=> e.name == getComparisonGroupName())
    if(comparison_group) {
      return comparison_group
    } else {
      return data.groups[$("input[name=tbar-grp]:checked").val()];
    }
  } else {
    return data.groups[$("input[name=tbar-grp]:checked").val()];
  }
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the learner object of me (i.e., the learner viewing the visualization) or the index of that 
 * learner in the 'data.learner' array.
 */
function getMe(doRetIdx) {
  for (var i=0, ni=data.learners.length; i < ni; i++) {
    var l = data.learners[i];
    if (data.learners[i].id === data.context.learnerId) return (doRetIdx ? i : l);
  }
  return (doRetIdx ? -1 : null);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Return the index (0-based) of the current student (i.e., "me") in the "others" ('getOthers()') array.
 */
function getMeInGrpIdx() {
  var id = getMe(false).id;
  var others = getOthers();
  for (var i=0, ni=others.length; i < ni; i++) {
    if (others[i].id === id) return i;
  }
  return -1;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the list of learners who make up the currently selected group.
 */
function getOthers() {
  var grp = getGrp();
  
  var res = [];
  for (var i=0, ni=data.learners.length; i < ni; i++) {
    var l = data.learners[i];
    if (jQuery.inArray(l.id, grp.learnerIds) >= 0) res.push(l);
  }
  return res;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the list of subgroups were the learner belongs
 */
function getGroupsUserBelong() {
  var id  = getMe(false).id;
  var res = []
  for (var i=0, ni=data.groups.length; i < ni; i++) {
    var grp = data.groups[i];
    var grpLearnerIds = grp.learnerIds;
    var grpName = grp.name;
    if (jQuery.inArray(id, grpLearnerIds) >= 0 && grpName!="Class Average") res.push(grpName);
  }
  return res;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Return the currently selected recommended activity.
 */
function getRec() {
  return (state.vis.act.recIdx === -1 ? null : state.vis.act.rsp.rec[state.vis.act.recIdx]);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Return the resource with the specified ID.  If 'id' is not specified the current resource is returned
 * instead.
 */
function getRes(id) {
  if (!id) return data.resources[state.vis.resIdx];
  
  var res = null;
  $map(function (x) { if (x.id === id) res = x; }, data.resources);
  return res;
}


// ------------------------------------------------------------------------------------------------------
function getRepLvl() {
  return data.reportLevels[$_("tbar-rep-lvl").value];
}


// ------------------------------------------------------------------------------------------------------
/**
 * Returns the currently selected topic.
 */
function getTopic() {
  return (state.vis.topicIdx === -1 ? null : data.topics[state.vis.topicIdx]);
}


// ------------------------------------------------------------------------------------------------------
function grpSet() {
  if (state.args.uiGridActLstMode && !state.args.adaptiveSC && !state.args.slidingControlSC) actLstHide();
  
  //Added by Jordan to track their userPreference regarding group selection in the Social Comparison
  var grp = getGrp();
  
  //$call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&parameter-name=grpToCompare&parameter-value=" + grp.name + "&app-name=MasteryGrids");
  if(state.args.controlSC) {
    var learnerIndex = getMeInGrpIdx()
    $call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + 
											  "&grp=" + state.curr.grp + 
											  "&sid=" + state.curr.sid + 
											  "&parameter-name=grpToCompare&parameter-value=" + grp.name + 
											  "&app-name=MasteryGrids&user-context=usrGroups:"+getGroupsUserBelong() + CONST.log.sep01 + "learnerIndex:" + learnerIndex);
  } else if(state.args.slidingControlSC && state.args.compGrpRangeModified) {
    $call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + 
											  "&grp=" + state.curr.grp + 
											  "&sid=" + state.curr.sid + 
											  "&parameter-name=compGrpRange&parameter-value=" + state.args.compGrpRange + 
											  "&app-name=MasteryGrids&user-context=grpSize:" + grp.learnerIds.length + CONST.log.sep01 + "learnerSliderIndex:" + state.args.learnerSliderIndex);
  }

  visDo(true, true, true);

  if(state.args.adaptiveSC || state.args.slidingControlSC) {
    if(ui.vis.actLst.cont.style.display !== 'none'){
      actLstShow(state.vis.lastCellSel.doMe,state.vis.lastCellSel.doVs,state.vis.lastCellSel.doGrp);
    }
  }

  log("action" + CONST.log.sep02 + "group-set", true, true);
}


// ------------------------------------------------------------------------------------------------------
function grpSetCellH(h) {
  state.vis.otherIndCellH = parseInt(h);
  
  if (getRes()) visDo(false, false, true);
}


// ------------------------------------------------------------------------------------------------------
function init() {
  stateArgsSet01();
  translatePage();

  log(
    "action"                 + CONST.log.sep02 + "app-start"                   + CONST.log.sep01 +
    "ui-tbar-vis"            + CONST.log.sep02 + state.args.uiTBarVis          + CONST.log.sep01 +
    "ui-tbar-mode-vis"       + CONST.log.sep02 + state.args.uiTBarModeVis      + CONST.log.sep01 +
    "ui-tbar-rep-lvl-vis"    + CONST.log.sep02 + state.args.uiTBarModeVis      + CONST.log.sep01 +
    "ui-tbar-topic-size-vis" + CONST.log.sep02 + state.args.uiTBarTopicSizeVis + CONST.log.sep01 +
    "ui-tbar-grp-vis"        + CONST.log.sep02 + state.args.uiTBarGrpVis       + CONST.log.sep01 +
    "ui-tbar-res-vis"        + CONST.log.sep02 + state.args.uiTBarResVis,
    false
  );
  
  loadData(); 
}

function websocketCallback(message) {
	if (vis) {
		var action = message.action;
		var result = message.result;


		if(action === "actLoad")   vis.actLoad();
		if(action === "actSubmit") vis.actSubmit();
		if(action === "actDone") {
			vis.actDone(parseInt(result));
		}
	}
}


// ------------------------------------------------------------------------------------------------------
function initUI() {
  // (1) The actual UI:
  $(document).ready(function() {
    // (1.1) Hide elements of the toolbar:
    if (!state.args.uiTBarVis) {
      $("body").addClass("tbar-0");
      $("#tbar").hide();
    }
    else {
      $("body").addClass("tbar-1");
      $("#tbar").show();
      
      if (!state.args.uiTBarModeVis      ? $("#tbar-mode-cont")       .hide() : $("#tbar-mode-cont")       .show());
      if (!state.args.uiTBarRepLvlVis    ? $("#tbar-rep-lvl-cont")    .hide() : $("#tbar-rep-lvl-cont")    .show());
      if (!state.args.uiTBarTopicSizeVis ? $("#tbar-topic-size-cont") .hide() : $("#tbar-topic-size-cont") .show());
      if (!state.args.uiTBarGrpVis       ? $("#tbar-grp-cont")        .hide() : $("#tbar-grp-cont")        .show());
      if (!state.args.uiTBarResVis       ? $("#tbar-res-cont")        .hide() : $("#tbar-res-cont")        .show());
      // @@@@@
      $("#tbar-grp-cell-h").hide();
      $("#tbar-grp-cell-h-unit").hide();
    }
    
    // (1.2) Tooltips:
    $(document).tooltip();

    if(state.args.slidingControlSC && state.args.uiTBarModeVis) { // To preset comparison option based on saved student preference
      state.args.uiTBarModeGrpChk = state.args.uiComparisonOption === 'sc-option-slider'
    }
    
    // (1.3) Toolbar:
    $("#tbar-mode").buttonset();

    if(state.args.uiTBarModeGrpChk){
      $("#tbar-mode-01")[0].checked = true;
      $("#tbar-mode-02")[0].checked = false;
      $("label[for|='tbar-mode-01']").children().text(t('tbar.enabled'))
      $("label[for|='tbar-mode-02']").removeClass("ui-state-active")
      $("label[for|='tbar-mode-01']").addClass("ui-state-active")
    } else{
        $("#tbar-mode-01")[0].checked = false;
        $("#tbar-mode-02")[0].checked = true;
        $("label[for|='tbar-mode-02']").children().text(t('tbar.disabled'))
        $("label[for|='tbar-mode-01']").removeClass("ui-state-active")
        $("label[for|='tbar-mode-02']").addClass("ui-state-active")
    }

    // Group mode button
    $("#tbar-mode-01").click(function () {
        state.args.uiTBarModeGrpChk = true;
        //alert("Grp click");
        if(state.args.slidingControlSC) {
          comparison_option_selected('sc-option-slider',true)
        } else {
          comparisonVisible(CONST.comparison.grpActive, CONST.comparison.meGrpActive, CONST.comparison.othersActive);
        }
        //compModeSet(CONST.vis.mode.grp); 
        $("label[for|='tbar-mode-01']").children().text(t('tbar.enabled'))
        $("label[for|='tbar-mode-02']").children().text(t('button.disable'))
    });
    // Individual mode button
    $("#tbar-mode-02").click(function () { 
        state.args.uiTBarModeGrpChk = false;
        //alert("indiv click");
        if(state.args.slidingControlSC) {
          comparison_option_selected('sc-option-disable',true)
        } else {
          comparisonVisible(false, false, false);
        }
        //compModeSet(CONST.vis.mode.ind); 
        $("label[for|='tbar-mode-01']").children().text(t('button.enable'))
        $("label[for|='tbar-mode-02']").children().text(t('tbar.disabled'))
    });
  
    
    $("#tbar-grp-cell-h")[0].selectedIndex = state.vis.otherIndCellH - CONST.vis.otherIndCellH.min;

    // (1.4) Grids:
    ui.vis.grid.cont.me     = $("#grid-me")     [0];
    ui.vis.grid.cont.grp    = $("#grid-grp")    [0];
    ui.vis.grid.cont.others = $("#grid-others") [0];
    
    document.onmousedown = function (e) {
      if ($evtMouseBtn(e) === 1) state.isMouseBtn1 = true;
    };
    
    document.onmouseup = function (e) {
      if ($evtMouseBtn(e) === 1) state.isMouseBtn1 = false;
    };
    
    document.oncontextmenu = function (e) {
      return false;
    };
    
    document.onkeyup = function (e) {
      switch ($evtCode(e)) {
        case 27:  // ESC
          if (state.vis.act.actIdx !== -1) actClose();
          else actLstHide(e, true);
          break;
      }
    };
    
    document.body.onmousewheel = function (e) {
      if (ui.scrollTimer) window.clearTimeout(ui.scrollTimer);
      
      ui.scrollTimer = window.setTimeout(
        function () {
          ui.scrollTimer = null;
          
          log(
            "action" + CONST.log.sep02 + "scroll"                    + CONST.log.sep01 +
            "y"      + CONST.log.sep02 + window.scrollY       + "px" + CONST.log.sep01 +
            "x"      + CONST.log.sep02 + window.scrollX       + "px" + CONST.log.sep01 +
            "scr-h"  + CONST.log.sep02 + window.screen.height + "px" + CONST.log.sep01 +
            "scr-w"  + CONST.log.sep02 + window.screen.width  + "px",
            true
          );
        },
        CONST.scrollTime
      );
    };
    
    
    // (1.5) Sunburst visualization:
    ui.vis.sunburst = $("#sunburst")[0];
    
    // (1.6) Activities list:
    ui.vis.actLst.cont  = $("#act-lst")[0];
    ui.vis.actLst.arrow = $("#act-lst-arrow")[0];

    
    // (1.7) Activity window:
    ui.vis.act.cont              = $("#act")[0];
    ui.vis.act.cont.onclick      = function(e) {
        if(state.vis.act.isResizing) state.vis.act.isResizing = false;
        else actClose();
    };
    ui.vis.act.cont.onmousewheel = function (e) {  // prevent scrolling of the main window while scrolling the frame content
      $evtTgt(e).scrollTop -= e.wheelDeltaY;
      $evtPrevDef(e);
    };
    
    ui.vis.act.title      = $("#act-title")        [0];
    ui.vis.act.table      = $("#act-tbl")          [0];
    ui.vis.act.frame      = $("#act-frame")        [0];
    ui.vis.act.frameRec   = $("#act-frame-rec")    [0];
    ui.vis.act.recLst     = $("#act-rec-lst")      [0];
    ui.vis.act.fbDiffCont = $("#act-fb-diff-cont") [0];
    ui.vis.act.fbDiffTxt  = $("#act-fb-diff-txt")  [0];
    ui.vis.act.fbRecCont  = $("#act-fb-rec-cont")  [0];
    ui.vis.act.fbRecTxt   = $("#act-fb-rec-txt")   [0];
    ui.vis.act.otherTxt   = $("#act-other-link")   [0];
    
    ui.vis.act.recLst.children[0].onclick = actLoadRecOriginal;
    
    ui.vis.act.fbDiffBtns[0] = $("#act-fb-diff-btn-0");  ui.vis.act.fbDiffBtns[0] .click(function (e) { actFbDiff(0); });
    ui.vis.act.fbDiffBtns[1] = $("#act-fb-diff-btn-1");  ui.vis.act.fbDiffBtns[1] .click(function (e) { actFbDiff(1); });
    ui.vis.act.fbDiffBtns[2] = $("#act-fb-diff-btn-2");  ui.vis.act.fbDiffBtns[2] .click(function (e) { actFbDiff(2); });
    
    ui.vis.act.fbRecBtns[0]  = $("#act-fb-rec-btn-0");   ui.vis.act.fbRecBtns[0]  .click(function (e) { actFbRec(0);  });
    ui.vis.act.fbRecBtns[1]  = $("#act-fb-rec-btn-1");   ui.vis.act.fbRecBtns[1]  .click(function (e) { actFbRec(1);  });
    ui.vis.act.fbRecBtns[2]  = $("#act-fb-rec-btn-2");   ui.vis.act.fbRecBtns[2]  .click(function (e) { actFbRec(2);  });
    
    // (1.8) Help dialog:
    ui.vis.helpDlg  = $("#help-dlg")[0];
    ui.vis.helpDlgTitle  = $("#help-dlg-title")[0];
    ui.vis.helpDlgCont  = $("#help-dlg-cont")[0];

    
    $("#act-fb-diff-cont #act-fb-diff") .buttonset();
    $("#act-fb-rec-cont  #act-fb-rec")  .buttonset();
    
    $("#act-close").button();
    
    $("#act-tbl")[0].onclick   = function (e) { $evtCancelProp(e); };  // prevent closing from onclick events
    $("#act-close")[0].onclick = actClose;
  });
  
  // (2) Reverse color scales (we need this for deviation from average -- colors associated with larger negative values should be darker and not lighter as is the case by default):
  CONST.vis.colors.grpRev = [];
  for (var i = 3; i <= 9; i++) {
    CONST.vis.colors.grpRev[i] = CONST.vis.colors.grp[i].slice();
    CONST.vis.colors.grpRev[i].reverse();
  }
  
  CONST.vis.colors.spectralRev = [];
  CONST.vis.colors.spectralRev[7] = CONST.vis.colors.spectral[7].slice();
  CONST.vis.colors.spectralRev[7].reverse();
  
  CONST.vis.colors.spectralRev[11] = CONST.vis.colors.spectral[11].slice();
  CONST.vis.colors.spectralRev[11].reverse();
  
  // (3) SVG common filters:
  ui.vis.svgCommon =
    d3.select(document.body).
    append("svg").
    attr("width", 0).
    attr("height", 0);
  
  // (3.1) Filter (blur):
  ui.vis.svgCommon.append("svg:defs").
    append("svg:filter").
    attr("id", "blur").
    append("svg:feGaussianBlur").
    attr("stdDeviation", 1.5);
    
  // (3.2) Filter (shadow):
  var filterShadow = ui.vis.svgCommon.append("svg:defs").
    append("svg:filter").
    attr("id", "shadow");
  filterShadow.append("svg:feGaussianBlur").
    attr("in", "SourceAlpha").
    attr("stdDeviation", 2);
  filterShadow.append("svg:feOffset").
    attr("dx", 0).
    attr("dy", 0).
    attr("result", "offsetblur");
  var feMerge = filterShadow.append("svg:feMerge");
  feMerge.append("svg:feMergeNode");
  feMerge.append("svg:feMergeNode").
    attr("in", "SourceGraphic");
  
  $( "#act-tbl" ).resizable({
      resize: function( event, ui ) {
          state.vis.act.isResizing = true;
      },
      alsoResize : '#act-frame,#act-frame-rec',
      handles: "all"
  });
  //$( "#act-frame" ).resizable();
  
}


// ------------------------------------------------------------------------------------------------------
function loadData() {
  vis.loadingShow();
  
  log("action" + CONST.log.sep02 + "data-load-start", false);
  
  (state.args.dataLive
    ? $call("GET", CONST.uriServer+"GetContentLevels?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&mod=all&models=" + (state.args.dataReqOtherLearners ? "-1" : "0") + "&avgtop=" + state.args.dataTopNGrp + "&removeZeroProgressUsers=" + state.args.removeZeroProgressUsers, null, loadData_cb, true, false)
    : $call("GET", "/um-vis-dev/data.js", null, loadData_cb, true, false)
  );
}


// ----^----
function loadData_cb(res) {
  // (1) Process the data:
  data = res;

  // if(state.args.uiGridOthersVis && state.args.dataReqOtherLearners) { // Need to filter learners that should not be in the learners array for social comparison. This could be also fixed on the server-side. 
    // data.learners = keep_learners_in_average_group(data.learners)
  // }

  // (2) Process arguments (fuse those passed through the query string and those passed in the server's response (the latter take precedence):
  stateArgsSet02();
  checkPreSurveys();
  checkPostSurveys();
  loadStaticData()
}

function loadStaticData() {
  if(state.args.uiExtraParamFile){
    $.getJSON("./data/" + state.args.uiExtraParamFile + "?v=202209190059", function(json) {
      if(state.args.uiGradualTopicOpening) {
        for (var i=0; i < json.topicTime.length ; i++) {
          var topic_order = json.topicTime[i].topicOrder - 1;
          var releaseDate = new Date(json.topicTime[i].releaseDate)
          var dueDate = json.topicTime[i].dueDate ? new Date(json.topicTime[i].dueDate): null
          var currentDate = new Date()
          
          data.topics[topic_order].unlockTime = releaseDate
          data.topics[topic_order].lockTime = dueDate
          data.topics[topic_order].locked =  currentDate < releaseDate || (state.args.uiLockTopicAfterDueDate && dueDate ? currentDate > dueDate: false)
        }
      }
      if(state.args.uiIncenCheck) {
        incentives.process_incentive_params(data.topics, json.incentives)
      }

      processData()
    });
  } else {
    processData()
  }
}

function checkPreSurveys() {
  if(state.args.requiredPreSurveys && state.args.requiredPreSurveys.length > 0) {
    //Check if all pre-surveys are completed from session storage
    var preSurveysCompleted = JSON.parse(sessionStorage.getItem(state.curr.grp + "_preSurveysCompleted")) || false;

    if(!preSurveysCompleted) {
      $call("GET", CONST.uriServer+"GetSurveyActions?usr=" + state.curr.usr + 
        "&grp=" + state.curr.grp, null, surveyAction_cb, true, false );
    }
  }
}

function surveyAction_cb(rsp) {
    var surveyActions = rsp;
    var allCompleted = true;
    var incompleteSurveyId = -1;
    var redirectSurveyId = state.args.completedSurveyId;

    for (var i=0; i < state.args.requiredPreSurveys.length; i++) {
       var surveyURL = state.args.requiredPreSurveys[i]
       // Extract the survey ID from the URL
       var surveyId = surveyURL.split("/").pop()

       var completionActions = surveyActions.filter(a=> (a.surveyId == surveyId && a.action === "complete"));
       if(completionActions.length == 0 && surveyId != redirectSurveyId) {
          allCompleted = false;
          incompleteSurveyId = i;
          break;
       }
    }
     
    if(allCompleted) {
      // If all pre-surveys are completed, set the flag to true
      sessionStorage.setItem(state.curr.grp + "_preSurveysCompleted", true);
    } else {
        // Redirect to the incomplete survey on Qualtrics
        var surveyUrl = state.args.requiredPreSurveys[incompleteSurveyId] + "?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid;
        // Change current page url to the survey url
        window.location.href = surveyUrl;
    }
}

function checkPostSurveys() {
  if(state.args.requiredPostSurveys && state.args.requiredPostSurveys.length > 0) {
    //Check if all post-surveys are completed from session storage
    var postSurveysCompleted = JSON.parse(sessionStorage.getItem(state.curr.grp + "_postSurveysCompleted")) || false;

    if(!postSurveysCompleted) {
      $call("GET", CONST.uriServer+"GetSurveyActions?usr=" + state.curr.usr + 
        "&grp=" + state.curr.grp, null, postSurveyAction_cb, true, false );
    }
  }
}

function postSurveyAction_cb(rsp) {
    var surveyActions = rsp;
    var allCompleted = true;
    var incompleteSurveyId = -1;
    var redirectSurveyId = state.args.completedSurveyId;

    for (var i=0; i < state.args.requiredPostSurveys.length; i++) {
       var surveyURL = state.args.requiredPostSurveys[i]
       // Extract the survey ID from the URL
       var surveyId = surveyURL.split("/").pop()

       var completionActions = surveyActions.filter(a=> (a.surveyId == surveyId && a.action === "complete"));
       if(completionActions.length == 0 && surveyId != redirectSurveyId) {
          allCompleted = false;
          incompleteSurveyId = i;
          break;
       }
    }
     
    if(allCompleted) {
      // If all pre-surveys are completed, set the flag to true
      sessionStorage.setItem(state.curr.grp + "_postSurveysCompleted", true);
    } else {
        // Redirect to the incomplete survey on Qualtrics
        var surveyUrl = state.args.requiredPostSurveys[incompleteSurveyId] + "?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid;
        // Change current page url to the survey url
        window.location.href = surveyUrl;
    }
}

function processData() {
  if(data.configprops.agg_reactiverec_enabled) {
	  pawswebsocket.openWebSocket(state.curr, websocketCallback);
  }
  
  if (!data.vis.color.value2color) data.vis.color.value2color = function (x) { var y = Math.log(x)*0.25 + 1;  return (y < 0 ? 0 : y); };  // use the logarithm function by default
  
  visAugmentData();
  
  loadSequencedActs(data);
  
  data._rt = {};
  data._rt.topicsOrd = data.topics.slice(0);  // save the original topic order

  
  // (3) Init UI:
  initUI();
  //stateLoad();
  
  document.title = state.args.mgTitle;
  
  // (3.1) Toolbar:
  // (3.1.1) Report levels:
  var repLvlSelIdx = -1;  // selected index
  for (var i = 0; i < data.reportLevels.length; i++) { if (data.reportLevels[i].isDefault) repLvlSelIdx = i; }
  for (var i = 0; i < data.reportLevels.length; i++) {
    var rl = data.reportLevels[i];
    var option = $$("option", $_("tbar-rep-lvl"), null, null, rl.name);
    option.value = i;
    
    if ((repLvlSelIdx !== -1 && repLvlSelIdx === i) || (repLvlSelIdx === -1 && state.args.defValRepLvl === rl.id)) option.selected = "selected";
  }
  

  // (3.1.2) Topic size:
  for (var i = 0; i < data.vis.topicSizeAttr.length; i++) {
    var tsa = data.vis.topicSizeAttr[i];
    var option = $$("option", $_("tbar-topic-size"), null, null, tsa[0].toUpperCase() + tsa.substr(1));
    option.value = tsa;
  }
  
  // (3.1.3) Groups:
  var grpSelIdx = -1;  // selected index
  for (var i = 0; i < data.groups.length; i++) { if (data.groups[i].isDefault) grpSelIdx = i; }

  for (var i = 0; i < data.groups.length; i++) {
    var grp = data.groups[i];
    // var option = $$("option", $_("tbar-grp"), null, null, grp.name);
    // option.value = i;
    var grpName = grp.name.replace(" ","_");
    var group_text = t(findKeyByValue(locales.en, grp.name))

    if (grp.name=="Class Average"){
      if(!state.args.hasMiddleComparisonGroup) {
        $('<input id="'+grpName+'" name="tbar-grp" value="'+i+'" type="radio" onclick="grpSet();" /><label class="grp-label" for="'+grpName+'">'+group_text+'</label>').appendTo("#group-selector");
      }
    }else{
      if (grp.name.substring(0,3)=="Top"){
        if(state.args.dataTopNGrp!=-1){
           $('<input id="'+grpName+'" name="tbar-grp" value="'+i+'" type="radio" onclick="grpSet();" /><label class="grp-label" for="'+grpName+'" >'+group_text+'</label>').appendTo("#group-selector");
        }
      }else{
        if(grp.name.includes("Lower")){
          $('<input id="'+grpName+'" name="tbar-grp" value="'+i+'" type="radio" onclick="grpSet();" /><label class="grp-label" for="'+grpName+'" >'+group_text+'</label>').prependTo("#group-selector");
        } else{
         $('<input id="'+grpName+'" name="tbar-grp" value="'+i+'" type="radio" onclick="grpSet();" /><label class="grp-label" for="'+grpName+'" >'+group_text+'</label>').appendTo("#group-selector");
        }
      }
    }
    //if ((grpSelIdx !== -1 && grpSelIdx === i) || (grpSelIdx === -1 && state.args.defValGrpIdx === i)) option.selected = "selected";
  }
  var grpToCompare = state.args.hasMiddleComparisonGroup ? "Middle third":"Class Average";
  if(state.args.grpToCompare != null){
    grpToCompare = state.args.grpToCompare;
  }
  grpToCompare = grpToCompare.replace(" ","_");
  $("input#"+grpToCompare).attr("checked",true);

  $('<a></a>').appendTo("#group-selector");
  
  
  // (3.1.4) Resources:
  var resSelIdx = -1;  // selected index
  for (var i = 0; i < data.resources.length; i++) { if (data.resources[i].isDefault) resSelIdx = i; }
  for (var i = 0; i < data.resources.length; i++) {
    var res = data.resources[i];
    var option = $$("option", $_("tbar-res"), null, null, res.name);
    option.value = i;
    
    if ((resSelIdx !== -1 && resSelIdx === i) || (resSelIdx === -1 && state.args.defValResId === res.id)) {
      option.selected = "selected";
      resSet(i+2, false, false);  // +2 because this is the index in the drop-down list and there always are two leading items
    }
  }
  // (3.1.5) Manual:
  if(data.vis.userManual){
  	var manualLink = $$("a", $_("tbar-manual"), null, null, "<img id=\"icon-manual\" src=\"./img/manual.png\" alt=\"user manual icon\" />User Manual");
  	manualLink.href = CONST.uriServer + "manuals/" + data.vis.userManual;
  	manualLink.target = "_blank";
  	manualLink.title = state.args.mgTitle + " User Manual";
  }
  
  // (4) Grids:
  if(!state.args.slidingControlSC && !state.args.adaptiveSC) { //visDo is called after groups are dynamically set
    visDo(true, true, true);
  }
 
  $('#overlay').click(overlayFadeOut);
  vis.loadingHide();
  
  
  log("action" + CONST.log.sep02 + "data-load-end", false);
  log("action" + CONST.log.sep02 + "app-ready",     true , true);

  if(state.curr.grp=="IS0017Fall2018"){
    var readerLink = $$("a", $_("tbar-book"), null, null, "<img id=\"icon-manual\" height= \"24\" width=\"24\" src=\"./img/book.png\" alt=\"user manual icon\" />Big Java Book");
    readerLink.href = "http://pawscomp2.sis.pitt.edu/ereader/login";
    readerLink.target = "_blank";
    readerLink.title = "Big Java Book (ereader + quizzes)";
  }

  if(state.curr.grp=="CMPUT175Fall2021"){
    var expiration_date = new Date(2021, 9, 17)
    var current_date = new Date()

    if(current_date < expiration_date) {
      var survey_image = document.createElement('img')
      $(survey_image).attr('id', 'icon-survey').attr('height', '24').attr('width','24').attr('src', './img/survey.png')
      $("#tbar-link").append(survey_image)
  
      var survey_link = $$("a", $("#tbar-link").get(0));
      survey_link.href = "https://ualberta.ca1.qualtrics.com/jfe/form/SV_7OsjwTsOua1huIK?studentid=" + state.curr.usr;
      survey_link.target = "_blank";
      survey_link.title = t('tbar.questionnaire');
      survey_link.innerHTML = t('tbar.questionnaire_days', { days: Math.round(( expiration_date- current_date)/60/60/24/1000) })
      $(survey_link).attr('id', 'survey_link').css('position','absolute').css('margin-top','6px')

      if(!Cookies.get('survey')) {
        Cookies.set('survey', 'shown', { expires: 7});
        $("#overlay").css("display","block");
        $(survey_link).css("z-index","200").css("color","red").css("background", "white");
      }
    }
  }

  if(state.curr.grp=="CMPUT175Spring2022"){
    var expiration_date = new Date(2022, 4, 31)
    var current_date = new Date()

    if(current_date < expiration_date) {
      var survey_image = document.createElement('img')
      $(survey_image).attr('id', 'icon-survey').attr('height', '24').attr('width','24').attr('src', './img/survey.png')
      $("#tbar-link").append(survey_image)
  
      var survey_link = $$("a", $("#tbar-link").get(0));
      survey_link.href = "https://ualberta.ca1.qualtrics.com/jfe/form/SV_2l9cAR0RV6TD5MW?studentid=" + state.curr.usr;
      survey_link.target = "_blank";
      survey_link.title = t('tbar.questionnaire');
      survey_link.innerHTML = t('tbar.questionnaire_days', { days: Math.round(( expiration_date- current_date)/60/60/24/1000) })
      $(survey_link).attr('id', 'survey_link').css('position','absolute').css('margin-top','6px')

      if(!Cookies.get('survey')) {
        Cookies.set('survey', 'shown', { expires: 7});
        $("#overlay").css("display","block");
        $(survey_link).css("z-index","200").css("color","red").css("background", "white");
      }
    }
  }

  if(state.curr.grp.includes("CMPUT175Fall2022")){
    var expiration_date = new Date(2022, 8, 27)
    var current_date = new Date()

    if(current_date < expiration_date) {
      var survey_image = document.createElement('img')
      $(survey_image).attr('id', 'icon-survey').attr('height', '24').attr('width','24').attr('src', './img/survey.png')
      $("#tbar-link").append(survey_image)
  
      var survey_link = $$("a", $("#tbar-link").get(0));
      survey_link.href = "https://ualberta.ca1.qualtrics.com/jfe/form/SV_ahIOxTE2CtLcbiK?studentid=" + state.curr.usr;
      survey_link.target = "_blank";
      survey_link.title = t('tbar.questionnaire');
      survey_link.innerHTML = t('tbar.questionnaire_days', { days: Math.round(( expiration_date- current_date)/60/60/24/1000) })
      $(survey_link).attr('id', 'survey_link').css('position','absolute').css('margin-top','6px')

      if(!Cookies.get('survey')) {
        Cookies.set('survey', 'shown', { expires: 7});
        $("#overlay").css("display","block");
        $(survey_link).css("z-index","200").css("color","red").css("background", "white");
      }
    }
  }

  if(state.curr.grp.includes("CMPUT174Fall2022")){
    var expiration_date = new Date(2022, 9, 3)
    var current_date = new Date()

    if(current_date < expiration_date) {
      var survey_image = document.createElement('img')
      $(survey_image).attr('id', 'icon-survey').attr('height', '24').attr('width','24').attr('src', './img/survey.png')
      $("#tbar-link").append(survey_image)
  
      var survey_link = $$("a", $("#tbar-link").get(0));
      survey_link.href = "https://ualberta.ca1.qualtrics.com/jfe/form/SV_79Avyn1YXvNl43A?studentid=" + state.curr.usr;
      survey_link.target = "_blank";
      survey_link.title = t('tbar.questionnaire');
      survey_link.innerHTML = t('tbar.questionnaire_days', { days: Math.round(( expiration_date- current_date)/60/60/24/1000) })
      $(survey_link).attr('id', 'survey_link').css('position','absolute').css('margin-top','6px')

      if(!Cookies.get('survey')) {
        Cookies.set('survey', 'shown', { expires: 7});
        $("#overlay").css("display","block");
        $(survey_link).css("z-index","200").css("color","red").css("background", "white");
      }
    }
  }

  if(state.curr.grp.includes("CMPUT175Spring2023")){
    var expiration_date = new Date(2023, 4, 20)
    var current_date = new Date()

    if(current_date < expiration_date) {
      var survey_image = document.createElement('img')
      $(survey_image).attr('id', 'icon-survey').attr('height', '24').attr('width','24').attr('src', './img/survey.png')
      $("#tbar-link").append(survey_image)
  
      var survey_link = $$("a", $("#tbar-link").get(0));
      survey_link.href = "https://ualberta.ca1.qualtrics.com/jfe/form/SV_0jjkoPdNeFdiMmi?studentid=" + state.curr.usr;
      survey_link.target = "_blank";
      survey_link.title = t('tbar.questionnaire');
      survey_link.innerHTML = t('tbar.questionnaire_days', { days: Math.round(( expiration_date- current_date)/60/60/24/1000) })
      $(survey_link).attr('id', 'survey_link').css('position','absolute').css('margin-top','6px')

      if(!Cookies.get('survey')) {
        Cookies.set('survey', 'shown', { expires: 7});
        $("#overlay").css("display","block");
        $(survey_link).css("z-index","200").css("color","red").css("background", "white");
      }
    }
  }

  if(state.curr.grp == "AaltoPythonFall20205" && !Cookies.get("peerselectionproblem-10022020")){
    Cookies.set("peerselectionproblem-10022020", 'shown', { expires: 60});
    $('#announcement')
      .html(t('announcement.peer_selection_fixed'))
      $('#announcement').show().css('position', 'relative');

  } else {
    $('#announcement').hide()
  }
  
  if(state.args.uiIncenCheck && state.curr.grp.startsWith("AaltoPythonFall2020")){
    if(!Cookies.get('extra-points-announcement-2')) {
      Cookies.set('extra-points-announcement-2', 'shown', { expires: 14});
      $("#extra_points_help").d3Click();
      $("#help-dlg").offset($("#extra_points_help").position());
      $("#overlay").css("display","block");
      $("#help-dlg").css("z-index","105");
    }
  }
  
  if(state.args.controlSC || state.args.adaptiveSC || state.args.slidingControlSC){
    $('#group-select-div').show()
    var helpDivContent = ""

    if(state.args.controlSC) {
      $('#slider-div').hide()
      $('#group-selector').show()

      $("#group-select-title").html(t('group_select.title_control') + "<image id='group-selector-help' width='22' height='19' src='img/help.png'>")

      // var group_text = state.args.hasMiddleComparisonGroup ? "third" : "half";

      if(state.args.hasMiddleComparisonGroup ) {
        helpDivContent = 
        '<p>' + t('help.group_comparison_intro') + '</p>' +
        '<p><b>' + t('tbar.lower_third') + ':</b> ' + t('help.group_comparison_lower') + '</p>' +
        '<p><b>' + t('tbar.middle_third') + ':</b> ' + t('help.group_comparison_middle') + '</p>' +
        '<p><b>' + t('tbar.higher_third') + ':</b> ' + t('help.group_comparison_higher') + '</p>'
      } else {
        helpDivContent += 
        '<p>' + t('help.group_comparison_intro') + '</p>' +
        '<p><b>' + t('tbar.lower_progress') + ':</b> ' + t('help.group_comparison_lower_half') + '</p>' +
        '<p><b>' + t('tbar.group_average') + ':</b> ' + t('help.group_comparison_average') + '</p>' +
        '<p><b>' + t('tbar.higher_progress') + ':</b> ' + t('help.group_comparison_higher_half') + '</p>'

        if(state.curr.grp.startsWith("UtrechtPythonSpring2021")) {
          if(!Cookies.get('random-assignment')) {
            Cookies.set('random-assignment', 'shown');
            helpDivContent += "<p><b style='background-color: lightskyblue;'>" + getComparisonGroupName() + "</b> group was <b>randomly</b> selected for you at the beginning of the course, but you can change your comparison group at any time.</p>"
          }
        }
      }

      // helpDivContent = 
      // '<p><b>Lower ' + group_text + ':</b> You are comparing your progress to the average progress of students in the lower ' +  group_text + ' of the class (when sorted by average percentage of completed activities).</p>' + 
      // (state.args.hasMiddleComparisonGroup ? '<p><b>Middle third:</b> You are comparing your progress to the average progress of students in the middle third of the class (when sorted by average percentage of completed activities).</p>'
      //                    :'<p><b>Class Average:</b> You are comparing your progress to the average progress of students in your class.</p>') +
      // '<p><b>Higher ' + group_text + ':</b> You are comparing your progress to the average progress of students in the higher ' + group_text + ' of the class (when sorted by average percentage of completed activities).</p>'
      
    } else if(state.args.adaptiveSC) {
      $('#slider-div').show()
      $('#group-selector').hide()

      $("#group-select-title").html(t('group_select.title_adaptive') + "<image id='group-selector-help' width='22' height='19' src='img/help.png'>")

      helpDivContent = 
        '<p>' + t('group_select.help_adaptive.intro') + '</p>' +
        t('group_select.help_adaptive.red_bar') +
        t('group_select.help_adaptive.auto') +

        initGroupSelectionSlider()
    } else if(state.args.slidingControlSC) {
      $('#slider-div').show()
      $('#group-selector').hide()


      var comparison_metric = get_comparison_metric()

      $("#group-select-title").html(t('group_select.title_slider', { metric: comparison_metric }) +"...<image id='group-selector-help' width='22' height='19' src='img/help.png'>")

      helpDivContent = 
      '<p>' + t('group_select.help_slider.intro') + '</p>' +
      t('group_select.help_slider.red_bar',{metric: comparison_metric}) +
      t('group_select.help_slider.turquoise_bar',{metric: comparison_metric}) + 
      '<p>' + t('group_select.help_slider.drag') + '</p>' +
      t('group_select.help_slider.note');
      
      initGroupSelectionSlider()

      if(state.args.uiTBarModeVis) {
        comparison_option_selected(state.args.uiComparisonOption, false)
      }
    }

    if(state.args.peerSelection) {
        $("#group-select-title").html(t('group_select.options') + "<image id='group-selector-help' width='22' height='19' src='img/help.png'>")
      
        $('#sc-option-selector').show()
        $('<input id="sc-option-disable" name="tbar-grp" value="sc-option-disable" type="radio" onclick="comparison_option_selected(this.id,true)"/><label class="grp-label" for="sc-option-disable" >' + t('comparison_option.disable') + '</label>')
          .appendTo("#sc-option-selector");
        $('<input id="sc-option-slider" name="tbar-grp" value="sc-option-slider" type="radio" onclick="comparison_option_selected(this.id,true)"/><label class="grp-label" for="sc-option-slider" >' + t('comparison_option.slider') + '</label>')
          .appendTo("#sc-option-selector");
        $('<input id="sc-option-peer" name="tbar-grp" value="sc-option-peer" type="radio" onclick="comparison_option_selected(this.id,true)"/><label class="grp-label" for="sc-option-peer" >' + t('comparison_option.peer') + '</label>')
          .appendTo("#sc-option-selector");
        
        $('<a></a>').appendTo("#sc-option-selector");
      
      $("input#" + state.args.uiComparisonOption).attr("checked",true);
      $("input[name=peer-consent]").on('change', peer_selection_consent_changed)

      comparison_option_selected(state.args.uiComparisonOption, false)
    }

    $('#group-selector-help').click(function(e) {
      if($('#group-select-help-div').is(":hidden")) {
        if(state.args.uiComparisonOption == "sc-option-disable") {
          $('#group-select-help-div').html(t('group_select.help_disable'))
        } else if(state.args.uiComparisonOption == "sc-option-peer") {
          $('#group-select-help-div').html(t('group_select.help_disable'))

        } else {
          $('#group-select-help-div').html(helpDivContent)
        }
        
        $('#group-select-help-div').show();
      } else {
        $('#group-select-help-div').hide();
      }
      
    })

    //Highlight the social comparison div when they first enter (repeats weekly)
    if(!Cookies.get("user-control-social-comparison")){
      Cookies.set('user-control-social-comparison', 'shown', { expires: 7});   
      $('#overlay').fadeIn(300);
      // $('#group-select-help-div').show().css('z-index','99999').css('position', 'relative');
      $('#group-selector-help').d3Click()
      $('#group-select-div').css('z-index','99999').css('position', 'relative');
      //$('#group-select-div').css('z-index','99999');
      //$('#group-select-help-div').css('z-index','99999')
      
    } else {
      $('#group-select-help-div').hide();
    }
   
  } else {
    $("div#group-select-div").hide();
    // Only show practice goal div when no SC option was selected
    // If one of SC options selected, practiceGoalSC handeled within those options. 
    if(state.args.practiceGoalSC) { 
      initPracticeGoal()
    }
  }

  if(state.args.practiceGoalSC) {
     //Highlight the practice goal div when they first enter (repeats weekly)
    if(!Cookies.get("practice-goal-sc")){
      Cookies.set('practice-goal-sc', 'shown', { expires: 7});   
      $('#overlay').fadeIn(300);
      $('#practice-goal-help').d3Click()
    } else {
      $('#practice-goal-help-div').hide();
    }
  }
}

function comparison_option_selected(option, report) {
  $('#group-select-div').css('width', "30%")
  close_peer_selection()
  $('#specific-peer-select-div').hide()
  $('#slider-div').hide()
  $("#peer-selection").hide()
  $('#group-select-help-div').hide()
  state.args.uiComparisonOption = option
  if(option== 'sc-option-peer') {
    loadClassList()
  } else if (option == 'sc-option-disable') {
    disable_sc()
  } else if(option == 'sc-option-slider') {
    initSlidingComparisonGroup()
    show_slider_sc()
  }

  if(state.args.uiTBarModeVis) {
    if(state.args.uiTBarModeGrpChk) {
      $('#group-select-div').show()
    } else {
      $('#group-select-div').hide()
    }
  }
  

  if(report) {
    var grp = getGrp();

    $call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + 
                    "&grp=" + state.curr.grp + 
                    "&sid=" + state.curr.sid + 
                    "&parameter-name=uiComparisonOption&parameter-value=" + state.args.uiComparisonOption + 
                    "&app-name=MasteryGrids&user-context=grpSize:" + grp.learnerIds.length + CONST.log.sep01 + "learnerSliderIndex:" + state.args.learnerSliderIndex);
  }
    
}

function is_report_level_progress() {
  return getRepLvl().id == 'p'
}

function get_comparison_metric() {
  return is_report_level_progress() ? t('help.progress'):t('help.performance')
}

function enable_sc() {
    state.args.uiTBarModeGrpChk = true;
    comparisonVisible(true, true, true);

    $("label[for=sc-option-disable]").text(t('comparison_option.disable')) 
}

function disable_sc() {
    switch_to_ind_view()
    $("label[for=sc-option-disable]").text(t('comparison_option.disable_label'))
}

function switch_to_ind_view() {
  state.args.uiTBarModeGrpChk = false;
  comparisonVisible(false, false, false);
}

function show_slider_sc() {
  enable_sc()
  $('#slider-div').show()
}

function peer_selection_consent_changed(event) {
  state.args.peerSelectionConsent = event.target.checked

  show_peer_sc()

  $call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + 
											  "&grp=" + state.curr.grp + 
											  "&sid=" + state.curr.sid + 
											  "&parameter-name=peerSelectionConsent&parameter-value=" + state.args.peerSelectionConsent + 
											  "&app-name=MasteryGrids");
}

function show_peer_sc() {
  if(!state.args.peerSelectionConsent) {
    close_peer_selection()
    $('#peer-consent-div').show()
    $('#btn-peer-lst-show').hide()
    $("#peer-selection-status").empty()
    state.args.selectedPeers = "none"
    state.args.peers_shown_once = false
  } else {
    $('#peer-consent-div').hide()
    $("input[name=peer-consent]").attr('checked', true)
    enable_sc()
    if(!state.args.peers_shown_once) {
      show_class_list()
      state.args.peers_shown_once = true
    } 
  }
  updateComparisonGroupByPeerSelection()
  $('#specific-peer-select-div').show()
}

function loadClassList() {
  if(!data.context.class_list) {
    if(state.curr.grp == "INFSCI2710Fall2021") {
      $call("GET", "http://adapt2.sis.pitt.edu/aggregateUMServices/GetClassList?grp=" + state.curr.grp + "&key=019f503fbdb7484c803c0bdb2e72cea0ae152d88ba95ae0813a57ccd1806d196", null, loadClassList_cb, true, false);
    } else if(state.curr.grp == "INFSCI2711Spring2022"){
      $call("GET", "http://adapt2.sis.pitt.edu/aggregateUMServices/GetClassList?grp=" + state.curr.grp + "&key=769217839b404205853b9de747bf08bb9b55ae44e52e35062e615723eaefed68", null, loadClassList_cb, true, false);
    } else if(state.curr.grp == "INFSCI2710Spring2022") {
      $call("GET", "http://adapt2.sis.pitt.edu/aggregateUMServices/GetClassList?grp=" + state.curr.grp + "&key=d40c6bc3aa2e3c21277ec682f8afdde13e5d36782c1a7c5ed5f83de3080f1a77", null, loadClassList_cb, true, false);
    }

  } else {
    show_peer_sc()
  }
}

function loadClassList_cb(res) {
  data.context.class_list = res.learners ? res.learners.map((e,i) => [e.learnerId,i, e.name]): []

  var consent_learners = data.learners.filter(e=> !e.isHidden && e.preferences.filter(f=> f.peerSelectionConsent == 'true').length > 0).map(e=>e.id)
  data.context.class_list = data.context.class_list.filter(e => consent_learners.includes(e[1].toString()))

  $('#btn-peer-lst-none').click(select_none_peers)
  $('#btn-peer-lst-all').click(select_all_peers)
  $('#btn-peer-lst-close').click(close_peer_selection)
  $('#btn-peer-lst-select').click(peers_selected)
  $('#btn-peer-lst-show').click(show_class_list)

  show_peer_sc()
}

function show_class_list() {
  var class_list = data.context.class_list.filter(e=>e[0] != state.curr.usr)

  $('#btn-peer-lst-show').hide()

  if(class_list && class_list.length > 0) {
    class_list.forEach(learner => {
      $("#peer-selection-content").append('<li><input type="checkbox" name="' + learner[0] +'">' + learner[2] + '</li>');
    })
  
    $('#peer-selection-content input').each(function() {
      this.checked = state.args.selectedPeers != "none" && state.args.selectedPeers.includes(this.name)
    });

    $("#peer-selection-status").html((state.args.selectedPeers != 'none'? t('peer.peers_selected', { count: state.args.selectedPeers.split('|').length }): t('peer.no_peers_selected')))
                               .show()

  } else {
    $("#peer-selection-content").append('<a>' + t('peers.no_peers') + '</a>')
    
  }
 
  $("#peer-selection").show().css('display', 'flex').css('flex-direction', 'column')
  $('#btn-peer-lst-show').hide()
  
}

function select_none_peers() {
  select_all_peers(false)
}

function select_all_peers() {
  select_all_peers(true)
}

function select_all_peers(all) {
  $('#peer-selection-content input').each(function() {
    this.checked = all          
});
}

function peers_selected() {
  var selected_peers = []
  
  $("#peer-selection-content input").get().forEach((e,i)=> {
    if(e.checked) {
      selected_peers.push([e.name,i])
    }
  })

  state.args.selectedPeers = selected_peers.map(e=> e[0]).join("|")

  $call("GET", CONST.uriServer+"UserPreference?usr=" + state.curr.usr + 
											  "&grp=" + state.curr.grp + 
											  "&sid=" + state.curr.sid + 
											  "&parameter-name=selectedPeers&parameter-value=" + state.args.selectedPeers + 
											  "&app-name=MasteryGrids&user-context=peerCount:" + selected_peers.length);

  updateComparisonGroupByPeerSelection()

  $("#peer-selection-status")
    .html(t('peer.peers_selected', { count: selected_peers.length })).show()
}

function updateComparisonGroupByPeerSelection() {

  // if(state.args.selectedPeers == "all") {
  //   var selected_peers = data.context.class_list
  // } else {
    var selected_peers = data.context.class_list.filter(e=>state.args.selectedPeers.includes(e[0]))
  // }
  
  var others = getOthersInAverageGroup()
      .filter(e=> e.id == state.curr.usr || selected_peers.map(e=> e[1]).includes(parseInt(e.id)))
  generateComparisonGroup(others)
}

function close_peer_selection() {
    $("#peer-selection").hide()
    $("#peer-selection-content").empty()
    $('#btn-peer-lst-show').show()
}


function initGroupSelectionSlider() {
  var range_all_sliders = {
    'min': [     0 ],
    '50%': [  50, 5 ],
    'max': [ 100 ]
  };

  var slider = document.getElementById('slider-div');

  $(slider).width("97%").css("margin-left", "10px")
  .css("margin-bottom", "50px")
  .css("margin-top", "10px")
  .css("margin-right", "10px")

  noUiSlider.create(slider, {
    start: [20, 40],
    behaviour: state.args.slidingControlSC? 'drag':'none',
    step: 5,
    connect: true,
    range: range_all_sliders,
    tooltips: [false,  false],
    pips: {
      mode: 'positions',
      values: [0, 25, 50, 75, 100],
        density: 5
    }
  });

  $("[class='noUi-handle']").toggleClass('user');
  $(".noUi-value").css("margin-top", "5px")

  var user_handle_div = document.createElement('div')
  var learner_slider_transform_perc = -32 - (1000 -50*10)

  $(user_handle_div)
        .attr('id', 'user-handle-div')
        .addClass("noUi-origin")
        .attr("disabled", true)
        .attr("style", "transform: translate(" +learner_slider_transform_perc + "%, 0px); z-index: 7;")

  var handle_div =  document.createElement('div')

  $(handle_div).addClass("noUi-handle user")

  var handle_div_2 =  document.createElement('div')
  $(handle_div_2).addClass("noUi-touch-area")

  var handle_div_3 =  document.createElement('div')
  $(handle_div_3).addClass("noUi-tooltip").text(t('peer.me')).hide()
     
  $(handle_div).append(handle_div_2)
  $(handle_div).append(handle_div_3)
  
  $(user_handle_div).append(handle_div)
  $(".noUi-base").append(user_handle_div)

  if(state.args.slidingControlSC) { // Allow users to change comparison group
    slider.noUiSlider.on("change", function(values, handle, unencoded, tap, positions, noUiSlider) {
      if(getComparisonRangeArray()[0] != values[0] || getComparisonRangeArray()[1] != values[1]) {
        state.args.compGrpRange = values[0] + "-" + values[1]
        state.args.compGrpRangeModified = true
        setUserSelectedComparisonGroup(values)
      }
    });
  } else { // Disable handlers
    var origins = slider.getElementsByClassName('noUi-origin');
    $(origins[0]).hide()
    $(origins[1]).hide()
    origins[0].setAttribute('disabled', true);
    origins[1].setAttribute('disabled', true);
  }

  slider.noUiSlider.on("start", function() {
    $(".noUi-tooltip").show()
  })

  slider.noUiSlider.on("end", function() {
    $(".noUi-tooltip").hide()
  })

  // $('#group-select-div').css("width", $(slider).width())

  if(state.args.adaptiveSC) {
    initAdaptiveComparisonGroup()
  } else if(state.args.slidingControlSC) {
    initSlidingComparisonGroup()
  }
}

/**
 * Updates or creates a progress gap div element with tooltips, styled numerical values, practice goal functionality,
 * and a compact feedback section.
 * @param {number} progressGap - The progress difference between the learner and the comparison group.
 */
function updateProgressGapDiv(progressGap) {
  // Check if the div already exists
  let div = document.querySelector('#progress-gap-info');
  if (!div) {
      // Create the main div element if it doesn't exist
      div = document.createElement('div');
      div.id = 'progress-gap-info';
      div.className = 'progress-gap-info';
      document.querySelector('#comparison-container').appendChild(div);
  } else {
      // Clear the existing content
      div.innerHTML = '';
  }

  // Make the div visible
  div.style.display = 'block';

  // --- LEGEND SECTION ---
  const legendContent = '<legend id="progress-gap-legend" style="font-size: 14px; color: darkblue;">' +
    t('progress_gap.set_practice_goal') + "<image id='practice-goal-help' width='22' height='19' src='img/help.png'></legend>"
  div.innerHTML += legendContent;

  // --- HELP DIV ---
  let helpDiv = document.getElementById('practice-goal-help-div');
  if (!helpDiv) {
    helpDiv = document.createElement('div');
    helpDiv.id = 'practice-goal-help-div';
    helpDiv.style.display = 'none'; // Only keep display inline
    helpDiv.innerHTML = `
      <b style="margin-top:-10px">${t('help.practice_goal.title')}</b>
      <p>
        ${t('help.practice_goal.text')}<br>
        <b>${t('help.practice_goal.how_to_use')}:</b>
        <ul style="margin-top:-10px; margin-left: -20px">
          <li>${t('help.practice_goal.steps.0')}</li>
          <li>${t('help.practice_goal.steps.1')}</li>
          ${state.args.slidingControlSC? "<li>" + t('help.practice_goal.steps.2') + "</li>":''}
          <li>${state.args.slidingControlSC ? t('help.practice_goal.steps.3'):t('help.practice_goal.steps.4')}</li>
        </ul>
        ${t('help.practice_goal.consistent_practice')}
      </p>
    `;
    div.style.position = 'relative';
    div.appendChild(helpDiv);
  }

  const helpIcon = div.querySelector('#practice-goal-help');
  if (helpIcon) {
    helpIcon.onclick = function () {
      helpDiv.style.display = helpDiv.style.display === 'none' ? 'block' : 'none';
      log('action: practice-goal-help', true);
    };
  }

  // Constants for calculations
  const activitiesPerSession = 8;
  
  const progressPerActivity = getProgressPerActivity()
  const totalActivitiesNeeded = Math.ceil(progressGap / progressPerActivity);
  const sessionsNeeded = Math.ceil(totalActivitiesNeeded / activitiesPerSession);

  // Log the values shown to the student
  logShownValues(totalActivitiesNeeded, sessionsNeeded);


  // Create the descriptive text
  const text = document.createElement('a');

  if (progressGap <= 0.0) {
    text.innerHTML = `
      ${CONST.vis.practiceGoalMessage} <br>
      <a>${t('progress_gap.consider_higher_peers')}</a>
    `;
  } else if (totalActivitiesNeeded > 20) {
    text.innerHTML = `
     ${CONST.vis.practiceGoalMessage} <br>
    <a>${t('progress_gap.try_closer_peers')}</a>
    `;
  } else {
    let activity_word = totalActivitiesNeeded > 1 ? t('progress_gap.activities_plural') : t('progress_gap.activities_singular')
    let session_word = sessionsNeeded > 1 ? t('progress_gap.sessions_plural') : t('progress_gap.sessions_singular')

    text.innerHTML = `
      ${CONST.vis.practiceGoalMessage} <br>
      <p style="margin-top: 5px;">${t('progress_gap.complete_to_improve', {count:totalActivitiesNeeded,
                                              activityWord: activity_word,
                                              sessions: sessionsNeeded,
                                              sessionWord: session_word 
      })}</p>
    `;
  }
  div.appendChild(text);

  // Add practice goal section
  const goalSection = document.createElement('div');
  goalSection.className = 'practice-goal-section';

  // Input for setting or displaying a practice goal
  const goalInput = document.createElement('input');
  goalInput.type = 'number';
  goalInput.min = 1;
  goalInput.max = 20;
  goalInput.placeholder = t('button.set_a_goal');
  goalInput.className = 'goal-input';

  const reviseGoalButton = document.createElement('button');
  reviseGoalButton.textContent = t('button.set_goal');
  reviseGoalButton.className = 'revise-goal-button';

  // Progress visualization
  const progressVisualization = document.createElement('div');
  progressVisualization.className = 'progress-visualization';
  progressVisualization.style.display = 'none'; // Hidden until a goal is set

  const thumbsUpButton = document.createElement('button');
  thumbsUpButton.textContent = '👍';
  thumbsUpButton.className = 'feedback-button thumbs-up';
  thumbsUpButton.style.display = 'none';

  const thumbsDownButton = document.createElement('button');
  thumbsDownButton.textContent = '👎';
  thumbsDownButton.className = 'feedback-button thumbs-down';
  thumbsDownButton.style.display = 'none';

  // Append elements to the goal section
  goalSection.appendChild(goalInput);
  goalSection.appendChild(reviseGoalButton);
  goalSection.appendChild(thumbsUpButton);
  goalSection.appendChild(thumbsDownButton);
  goalSection.appendChild(progressVisualization);
  div.appendChild(goalSection);

  // Event listener for revising the goal
  reviseGoalButton.addEventListener('click', () => {
      // Save the goal
      // Check if goalInput has a valid integer value above 0 and not empty
      if (!goalInput.value.trim() || isNaN(goalInput.value) || parseInt(goalInput.value, 10) <= 0) {
          alert(t('progress_bar.alert_invalid_goal'));
          return;
      }
      const goal = parseInt(goalInput.value, 10);
      localStorage.setItem('practiceGoal', goal);
      localStorage.setItem('practiceProgress', 0); // Reset progress

      // appendTargetHandler(goal); 

      logPracticeGoal(goal); // Log the goal
      updateProgressVisualization(progressVisualization, goal, 0);
      progressVisualization.style.display = 'block';
      $(thumbsUpButton).hide();
      $(thumbsDownButton).hide();

      
  });

  // Load existing goal and progress
  const storedGoal = parseInt(localStorage.getItem('practiceGoal'), 10);
  const storedProgress = parseFloat(localStorage.getItem('practiceProgress'), 10);
  if (storedGoal && storedProgress !== null) {
      goalInput.value = storedGoal;
      updateProgressVisualization(progressVisualization, storedGoal, storedProgress);
      progressVisualization.style.display = 'block';
      // Show feedback buttons only if goal is completed
      if (storedProgress >= storedGoal) {
        $(thumbsUpButton).show();
        $(thumbsDownButton).show();
      } else {
          $(thumbsUpButton).hide();
          $(thumbsDownButton).hide();
      }
  }

  // Add feedback section
  const feedbackSection = document.createElement('div');
  feedbackSection.className = 'feedback-section sliding-feedback-section';
  feedbackSection.style.display = 'none'; // Initially hidden

  // Add a title or intro text
  const feedbackTitle = document.createElement('div');
  feedbackTitle.className = 'feedback-title';
  feedbackTitle.innerHTML = `<b>${t('progress_gap.feedback.title')}</b>`;

  // Multiple choice question for goal setting
  const goalChoiceLabel = document.createElement('label');
  goalChoiceLabel.textContent = t('progress_gap.feedback.prompt');

  // Define the options as an array of [value, label]
  const goalOptions = [
    ["challenge-myself", t('progress_gap.feedback.options.challenge_myself')],
    ["comfortable-pace", t('progress_gap.feedback.options.comfortable_pace')],
    ["teacher-guidance", t('progress_gap.feedback.options.teacher_guidance')],
    ["peer-inspiration", t('progress_gap.feedback.options.peer_inspiration')],
    ["peers-higher", t('progress_gap.feedback.options.peers_higher')],
  ];

  // Shuffle the options array (Fisher-Yates shuffle)
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  var shuffledOptions = shuffle(goalOptions.slice()); // Use a copy

  const goalChoiceSelect = document.createElement('select');
  goalChoiceSelect.className = 'goal-choice-select';

  // Build the select HTML with the shuffled options
  goalChoiceSelect.innerHTML = `<option value="" disabled selected>${t('progress_gap.feedback.select_option')}</option>` +
    shuffledOptions.map(opt => `<option value="${opt[0]}">${opt[1]}</option>`).join("");
  
  goalChoiceSelect.innerHTML += `<option value="other">${t('progress_gap.feedback.options.other')}</option>`; // Add "Other" option at the end
  
  // Free text input for "Other" option, initially hidden
  const goalChoiceOtherInput = document.createElement('input');
  goalChoiceOtherInput.type = 'text';
  goalChoiceOtherInput.className = 'goal-choice-other-input';
  goalChoiceOtherInput.placeholder = t('progress_gap.feedback.please_specify');
  goalChoiceOtherInput.style.display = 'none';

  // Show/hide free text input based on selection
  goalChoiceSelect.addEventListener('change', function() {
    if (goalChoiceSelect.value === 'other') {
      goalChoiceOtherInput.style.display = 'block';
    } else {
      goalChoiceOtherInput.style.display = 'none';
      goalChoiceOtherInput.value = '';
    }
  });

  // Feedback textarea
  const feedbackInput = document.createElement('textarea');
  feedbackInput.className = 'feedback-input';
  feedbackInput.placeholder = t('progress_gap.feedback.placeholder');

  feedbackInput.className = 'feedback-input';

  // Submit and hide buttons
  const submitFeedbackButton = document.createElement('button');
  submitFeedbackButton.textContent = t('button.submit_feedback');
  submitFeedbackButton.className = 'submit-feedback-button';

  // Add a button to hide the feedback section
  const hideFeedbackButton = document.createElement('button');
  hideFeedbackButton.textContent = t('button.hide');
  hideFeedbackButton.className = 'hide-feedback-button';
  hideFeedbackButton.addEventListener('click', () => {
      feedbackSection.style.display = 'none';
      log('action: feedback-hide', true);
  });
  
  feedbackSection.appendChild(feedbackTitle);
  feedbackSection.appendChild(goalChoiceLabel);
  feedbackSection.appendChild(goalChoiceSelect);
  feedbackSection.appendChild(goalChoiceOtherInput); // <-- append the input here
  feedbackSection.appendChild(feedbackInput);
  feedbackSection.appendChild(submitFeedbackButton);
  feedbackSection.appendChild(hideFeedbackButton);

  submitFeedbackButton.addEventListener('click', () => {
    const feedbackText = feedbackInput.value.trim();
    const goalChoice = goalChoiceSelect.value;
    const goalChoiceOther = goalChoiceOtherInput.value.trim();
    if (goalChoice) {
        if (goalChoice === 'other' && goalChoiceOther) {
            log(`action: feedback-goal-choice, choice: other, text: ${goalChoiceOther}`, true);
        } else {
            log(`action: feedback-goal-choice, choice: ${goalChoice}`, true);
        }
    }
    if (feedbackText) {
        log(`action: feedback-text, text: ${feedbackText}`, true);
        feedbackInput.value = ''; // Clear the input
    }
    feedbackSection.style.display = 'none'; // Hide the feedback section
  });

  // Style goalSection for relative positioning
  goalSection.style.position = 'relative';
  // Append feedbackSection as a sibling, not a child, for absolute positioning
  goalSection.parentNode.appendChild(feedbackSection);

  // Position feedbackSection as a sliding window to the right of goalSection
  function showFeedbackSection() {
    // Shuffle and rebuild the select options every time feedbackSection is shown
    const shuffledOptions = shuffle(goalOptions.slice());
    goalChoiceSelect.innerHTML = `<option value="" disabled selected>${t('progress_gap.feedback.select_option')}</option>` +
      shuffledOptions.map(opt => `<option value="${opt[0]}">${opt[1]}</option>`).join("") +
      `<option value="other">${t('progress_gap.feedback.options.other')}</option>`;

    goalChoiceSelect.selectedIndex = 0;
    goalChoiceOtherInput.value = '';
    goalChoiceOtherInput.style.display = 'none';
    feedbackInput.value = '';
    feedbackSection.style.display = 'block';
  }

  // When thumbs up/down is clicked, show the feedback section as a sliding window
  thumbsUpButton.addEventListener('click', () => {
      log('action: feedback-thumbs-up', true);
      showFeedbackSection();
  });
  thumbsDownButton.addEventListener('click', () => {
      log('action: feedback-thumbs-down', true);
      showFeedbackSection();
  });

  goalSection.appendChild(feedbackSection); // Place feedback section next to the goal button
}

function getProgressPerActivity() {
  var totalNumberOfActivities = data.topics.filter(t => t.id != 'AVG').flatMap(t => Object.values(t.activities).map(e=>e.length)).reduce((a,b)=>a+b)

  return 100.0/totalNumberOfActivities; // in percentage on average (not exact calculation)
}

function appendTargetHandler(goal) {
  var goal_slider_index = findLearnerSliderIndex() + Math.ceil(goal * getProgressPerActivity())
  var goal_handle_div = document.createElement('div');
  var goal_slider_transform_perc = -32 - (1000 - goal_slider_index * 10); // You need to define goal_slider_index

  $('#goal-handle-div').remove();
  
  $(goal_handle_div)
    .attr('id', 'goal-handle-div')
    .addClass("noUi-origin")
    .attr("disabled", true)
    .attr("style", "transform: translate(" + goal_slider_transform_perc + "%, 0px); z-index: 8;");

  // You can use an emoji, SVG, or <img> for the icon
  var goal_icon_div = document.createElement('div');
  $(goal_icon_div)
    .addClass("noUi-handle goal")
    .css({
      "font-size": "22px",
      "line-height": "22px",
      "text-align": "center",
      "width": "22px",
      "height": "22px",
      "background": "transparent",
      "box-shadow": "none",
      "border": "none"
    })
    .html("🎯"); // Or use <img src="target.svg"> or inline SVG

  goal_handle_div.appendChild(goal_icon_div);

  // Append to slider
  $(".noUi-base").append(goal_handle_div);
}

/**
 * Updates the progress visualization.
 * @param {HTMLElement} visualization - The visualization container.
 * @param {number} goal - The practice goal.
 * @param {number} progress - The current progress.
 */
function updateProgressVisualization(visualization, goal, progress) {
  // Clear the existing content
  visualization.innerHTML = '';

  // Create the progress bar container
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.position = 'relative'; // Ensure dividers are positioned relative to the bar

  // Create the progress bar fill
  const progressBarFill = document.createElement('div');
  progressBarFill.className = 'progress-bar-fill';
  progressBarFill.style.width = `${(progress / goal) * 100}%`;

  // Add dividers inside the progress bar (relative to the entire bar)
  for (let i = 1; i < goal; i++) {
      const divider = document.createElement('div');
      divider.className = 'progress-divider';
      divider.style.position = 'absolute';
      divider.style.left = `${(i / goal) * 100}%`; // Position relative to the entire bar
      progressBar.appendChild(divider); // Append dividers to the progress bar, not the fill
  }

  // Add progress text inside the progress bar fill
  const progressText = document.createElement('span');
  progressText.className = 'progress-text';
  progressText.textContent = `${progress % 1 === 0 ? progress : progress.toFixed(1)}/${goal}`;
  progressBarFill.appendChild(progressText);

  // Append the progress bar fill to the progress bar
  progressBar.appendChild(progressBarFill);

  // Append the progress bar to the visualization container
  visualization.appendChild(progressBar);

  // Check if the goal is completed
  if (progress >= goal) {
      const goodJobMessage = document.createElement('p');
      goodJobMessage.textContent = t('progress_gap.good_job');
      goodJobMessage.className = 'good-job-message';
      visualization.appendChild(goodJobMessage);

      // Show feedback buttons when goal is completed
      $('.thumbs-up').show();
      $('.thumbs-down').show();

      // Log goal completion
      logGoalCompletion(goal);

      // Clear local storage after showing the completion message
      setTimeout(() => {
          goodJobMessage.remove();
          const newGoalMessage = document.createElement('p');
          newGoalMessage.textContent = t('progress_gap.set_new_goal');
          newGoalMessage.className = 'new-goal-message';
          visualization.appendChild(newGoalMessage);

          // Clear local storage for the goal and progress
          localStorage.removeItem('practiceGoal');
          localStorage.removeItem('practiceProgress');
      }, 3000);
  } else {
    // Hide feedback buttons if goal is not completed
    $('.thumbs-up').hide();
    $('.thumbs-down').hide();
  }
}

/**
* Updates the practice progress.
* @param {number} increment - The number of activities completed.
*/
function updatePracticeProgress(increment) {
  const goal = parseInt(localStorage.getItem('practiceGoal'), 10);

  if(!goal) {
    return; // No goal set, do not update progress
  }
  
  let progress = parseFloat(localStorage.getItem('practiceProgress'), 10) || 0;
  progress = Math.min(progress + increment, goal); // Ensure progress doesn't exceed the goal
  localStorage.setItem('practiceProgress', progress);
  logPracticeProgress(progress); // Log the progress

  // Update the visualization
  const progressVisualization = document.querySelector('.progress-visualization');
  if (progressVisualization) {
      updateProgressVisualization(progressVisualization, goal, progress);
  }
}

/**
* Logs the practice goal to the server.
* @param {number} goal - The practice goal.
*/
function logPracticeGoal(goal) {
  log(`action: set-practice-goal, goal: ${goal}`, true);
}

/**
* Logs the practice progress to the server.
* @param {number} progress - The current progress.
*/
function logPracticeProgress(progress) {
  log(`action: update-practice-progress, progress: ${progress}`, true);
}

/**
 * Logs the goal completion to the server.
 * @param {number} goal - The completed practice goal.
 */
function logGoalCompletion(goal) {
  log(`action: goal-completed, goal: ${goal}`, true);
}

/**
 * Logs the values shown to the student.
 * @param {number} totalActivitiesNeeded - The total number of activities needed to close the gap.
 * @param {number} sessionsNeeded - The total number of sessions needed to close the gap.
 */
function logShownValues(totalActivitiesNeeded, sessionsNeeded) {
  log(
      `action: progress-gap-shown, totalActivitiesNeeded: ${totalActivitiesNeeded}, sessionsNeeded: ${sessionsNeeded}`,
      true
  );
}

function initSlidingComparisonGroup() {
    state.args.compGrpRangeModified = false

    var learner_slider_index = findLearnerSliderIndex()
    var comp_range = getComparisonRangeArray()
    
    setComparisonSlider(comp_range[0], comp_range[1], learner_slider_index)
    setUserSelectedComparisonGroup(comp_range)
}

function initPracticeGoal() {
    const groupState = getGrp()?.state?.topics?.['AVG']?.values?.['AVG'];
    const userState = getMe()?.state?.topics?.['AVG']?.values?.['AVG'];

    if (groupState && userState && groupState.p !== undefined && userState.p !== undefined) {
      const grpProgress = groupState.p;
      const usrProgress = userState.p;
      const progressGap = parseFloat(((grpProgress-usrProgress) * 100).toFixed(2));
      
      updateProgressGapDiv(progressGap);
    } else {
      console.error("Error: Unable to retrieve progress data for group or user.");
    }
}

function setUserSelectedComparisonGroup(slider_state) {
  var others = getOthersInAverageGroup()
  var learners_max_index = others.length - 1

  var left_index = learners_max_index - Math.ceil((learners_max_index/100)*slider_state[0])
  var right_index = learners_max_index - Math.floor((learners_max_index/100)*slider_state[1])

  var selected_learners = others.slice(right_index, left_index+1)

  generateComparisonGroup(selected_learners)
  if(state.args.practiceGoalSC) {
    initPracticeGoal()
  }
  
}

function initAdaptiveComparisonGroup() {
  var learners_length = data.learners.length
  var selected_learners = data.learners

  if(learners_length > 1) {
    var learner_index = getMe(true)
    var learners_max_index = learners_length - 1

    var learner_slider_index = Math.max(0,100 - Math.ceil((100*learner_index)/learners_max_index))
    
    var lower_portion = Math.max(1, parseInt(learners_max_index/7))
    var higher_portion = Math.max(2,parseInt(learners_max_index/5))

    var left_index = Math.min(learners_max_index, learner_index+lower_portion)
    var right_index = Math.max(0, learner_index-higher_portion)
    
    var left_slider_index = 100 - Math.ceil((100*left_index)/learners_max_index)
    var right_slider_index = 100 - Math.ceil((100*right_index)/learners_max_index)

    setComparisonSlider(left_slider_index, right_slider_index, learner_slider_index)

    if(learners_length >= 3) {
      selected_learners = data.learners.slice(right_index, left_index + 1) // To include the left_index as well
    } 
  } else { // There is only one learner and it is the user
    setComparisonSlider(0, 100, 100)
  }
  
  generateComparisonGroup(selected_learners)
}

/**
 * This function is to remove learners that should not be in comparison groups. Main elimination reason is being non-student.
 * Instead of duplicating filtering process on client-side, just keeping learners in Class Average group would be sufficient.
 * This makes sure that any change in server-side filtering would be reflected to client-side. 
 */
function keep_learners_in_average_group(learners) {
  return learners.filter(learner => data.groups[0].learnerIds.includes(learner.id))
}

function setComparisonSlider(left_slider_index, right_slider_index, learner_slider_index) {
  
  var slider = $('#slider-div')[0]
  slider.noUiSlider.set([left_slider_index, right_slider_index])

  if(learner_slider_index >=0 && learner_slider_index <=100) {
    $('#user-handle-div').show()
    var learner_slider_transform_perc = -32 - (1000 -learner_slider_index*10)
    $('#user-handle-div')
        .attr("style", "transform: translate(" +learner_slider_transform_perc + "%, 0px); z-index: 7;")
  } else {
    $('#user-handle-div').hide()
  }
  
  state.args.compGrpRange = left_slider_index + "-" + right_slider_index
  state.args.learnerSliderIndex = learner_slider_index
}

function generateComparisonGroup(learners) {
  var comparison_group_name = getComparisonGroupName()

  var comparison_group = data.groups.find(e=> e.name == comparison_group_name)
  
  var learner_ids = learners.map(e => e.id)
  var topic_state = {}
  var activity_state = {}

  data.topics.forEach(topic => {
    topic_state[topic.id] = {values: {}, overall: {}}
    var new_topic = topic_state[topic.id]

    activity_state[topic.id] = {}
    var new_activity = activity_state[topic.id]

    data.resources.forEach(resource => {
      if(new_topic.values[resource.id] == undefined) {
        new_topic.values[resource.id] = {}
      }

      if(new_activity[resource.id] == undefined) {
        new_activity[resource.id] = {}
      }

      data.reportLevels.forEach(report_level => {
        if (!new_topic.values[resource.id][report_level.id]) {
          new_topic.values[resource.id][report_level.id] = 0;
        }

        if(topic.activities && resource.id != "AVG") {
          topic.activities[resource.id].forEach(act => {
              if(new_activity[resource.id][act.id] == undefined) {
                new_activity[resource.id][act.id] = {values:{}}
              }

              if(!new_activity[resource.id][act.id].values[report_level.id]) {
                new_activity[resource.id][act.id].values[report_level.id] = 0
              }
          })
        }

        learners.forEach(learner => {
          new_topic.values[resource.id][report_level.id] += 
                  (learner.state.topics[topic.id].values[resource.id][report_level.id]/learners.length);
          if(topic.activities && resource.id != "AVG") {
            topic.activities[resource.id].forEach(act => {
                new_activity[resource.id][act.id].values[report_level.id] += 
                        (learner.state.activities[topic.id][resource.id][act.id].values[report_level.id]/learners.length)
            })
          }
        })
      })
    })
  })  

  var new_state = {topics: topic_state, activities: activity_state}

  if(!comparison_group) {
    comparison_group = {name: getComparisonGroupName(), state: new_state, learnerIds: learner_ids}
    data.groups.push(comparison_group)
  } else {
    comparison_group.state = new_state
    comparison_group.learnerIds = learner_ids
  }

  grpSet()
}

function findLearnerSliderIndex() {
  var others = getOthersInAverageGroup()
  var learners_max_index = others.length - 1
  var learner_index = getMeInAverageGrpIdx()
  var learner_slider_index = 100 // Default slider index
  
  if(learners_max_index > 0) {
    learner_slider_index = Math.max(0,100 - Math.ceil((100*learner_index)/learners_max_index))
  }

  return learner_slider_index
}

function getComparisonRangeArray() {
  if(state.args.compGrpRange != null) {
    return state.args.compGrpRange.split('-')
  } else {
    return [25.00, 75.00]
  }
}

function getComparisonGroupName() {
  if(state.args.adaptiveSC) {
    return t('grid.dynamic_group')
  } else if(state.args.slidingControlSC) {
    return t('grid.peer_group')
  } else {
    return getGrp().name
  }
}

function getMeInAverageGrpIdx() {
  var id = getMe(false).id;
  var others = getOthersInAverageGroup();
  for (var i=0, ni=others.length; i < ni; i++) {
    if (others[i].id === id) return i;
  }
  return -1;
}


function getOthersInAverageGroup() {
  var grp = data.groups.find(g => g.name == "Class Average")
  
  var res = [];
  for (var i=0, ni=data.learners.length; i < ni; i++) {
    var l = data.learners[i];
    if (jQuery.inArray(l.id, grp.learnerIds) >= 0) res.push(l);
  }
  return res;
}

function overlayFadeOut() {
	$('#overlay').fadeOut(300, function() {
    $('#group-select-help-div').hide().css('z-index','1');
    $('#group-select-div').css('z-index','1');
		//$('#group-select-div').css('z-index','1');
    $('#group-select-help-div').css('z-index','1')
    // $('#announcement').css('z-index','1').hide()
    $("#survey_link").css("z-index","1").css("color","black").css("background", "rgb(218 218 218)");
    $('#practice-goal-help-div').hide();
	});
}


// ------------------------------------------------------------------------------------------------------
function loadDataOthers() {
  
  actLstHide();

  if(!state.args.dataReqOtherLearners) {
    var btn = $("#btn-others-load");
    btn.prop("disabled", true);
    var action = 'load-others-list';
    if(btn.attr("value").substring(0,6) === 'Update') action = 'update-others-list';
    
    btn.attr("value", t('button.loading'));
    

    $call("GET", CONST.uriServer+"GetContentLevels?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&sid=" + state.curr.sid + "&cid=" + state.curr.cid + "&mod=all&avgtop=" + state.args.dataTopNGrp + "&models=-1&removeZeroProgressUsers=" + state.args.removeZeroProgressUsers, null, loadDataOthers_cb, true, false);
    
    log("action" + CONST.log.sep02 + action, true, true);
  } else {
    state.args.dataReqOtherLearners = false
    var btn = $("#btn-others-load");
    btn.prop("disabled", false);
    btn.attr("value", t('grid.show_ranked_list', {comparison_metric: get_comparison_metric()}));
    visDo(false, false, true);
    var action = 'hide-others-list';
    log("action" + CONST.log.sep02 + action, true, true);
  }
}


// ----^----
function loadDataOthers_cb(res) {
  state.args.dataReqOtherLearners = true;
  
  data.learners = res.learners;
  visAugmentData_addAvgTopic (data.learners);
  visAugmentData_addAvgRes   (data.learners);
  
  visDo(false, false, true);
  
  var btn = $("#btn-others-load");
  btn.prop("disabled", false);
  btn.attr("value", t('grid.hide_ranked_list', {comparison_metric: get_comparison_metric()}));
}

function loadSequencedActs(data){
    var temp = "";
    //alert("2");
    if(typeof state.sequencedActs != "undefined" && state.sequencedActs != null){
        // 
        for (var iTopic=0, nTopic=data.topics.length; iTopic < nTopic; iTopic++) {
            var topic = data.topics[iTopic];
            if (topic.id === "AVG") continue;
            temp = temp + topic.id + ": ";
            for (var iRes=0, nRes=data.resources.length; iRes < nRes; iRes++) {
              var res = data.resources[iRes];
              if (res.id === "AVG") continue;
              temp = temp + res.id + ":";
              for(var iAct=0, nAct=data.topics[iTopic].activities[res.id].length; iAct<nAct; iAct++){
                  var act = data.topics[iTopic].activities[res.id][iAct];
                  //temp = temp + act.id + ",";
                  var s = getMe().state;
                  var stateAct = s.activities[topic.id][res.id][act.id];
                  
                  if(typeof stateAct != "undefined" && stateAct != null){
                      if(typeof stateAct.sequencing != "undefined" && stateAct.sequencing != null){
                          if(stateAct.sequencing > 0){
                              //temp = temp + act.id + ":" + stateAct.sequencing + ",";
                              state.sequencedActs.push(topic.id+"/"+act.id+"/"+stateAct.sequencing);
                          }
                      }
                  }
              }
               
              
            }
            //temp = temp + "\n";
        }
        //alert(temp);
        
    }
}

function sequencedActs4Log(){
    var r = "";
    for(var iSeq = 0, nSeq=state.sequencedActs.length; iSeq<nSeq; iSeq++){
        r += state.sequencedActs[iSeq] + "|";
    }
    return r;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Requests the action provided to be logged on the server.  Context information can be added as well.
 */
function log(action, doAddCtx, addGroupTopicState) {
  
  var uri = CONST.uriServer + "TrackAction?" +
    "usr="    + state.curr.usr + "&" +
    "grp="    + state.curr.grp + "&" +
    "sid="    + state.curr.sid + "&" +
    "cid="    + state.curr.cid + "&" +
    "action=" + action;
    
  if(doAddCtx) {
    var group = getGrp()

    uri+= CONST.log.sep01 +
        //"ctx-comparison-mode-name"      + CONST.log.sep02 + (state.vis.mode === CONST.vis.mode.grp ? "grp" : "ind")            + CONST.log.sep01 +
        "ctx-comparison-mode-name"      + CONST.log.sep02 + (state.args.uiTBarModeGrpChk ? "grp" : "ind")            + CONST.log.sep01 +
        "ctx-report-level-id"           + CONST.log.sep02 + getRepLvl().id                                                     + CONST.log.sep01 +
        "ctx-topic-size-attribute-name" + CONST.log.sep02 + state.vis.topicSize.attr                                           + CONST.log.sep01 +
        "ctx-group-name"                + CONST.log.sep02 + group.name                                                      + CONST.log.sep01 +
        "ctx-resource-id"               + CONST.log.sep02 + (state.vis.resIdx >= 0 ? data.resources[state.vis.resIdx].id : "ALL") + 
      (state.args.slidingControlSC? 
            CONST.log.sep01 + 
                "ctx-usr-slider-index" + CONST.log.sep02 + state.args.learnerSliderIndex + CONST.log.sep01 +
                "ctx-group-size"       + CONST.log.sep02 + group.learnerIds.length + CONST.log.sep01 +
                "ctx-comp-group-slider-range" + CONST.log.sep02 + state.args.compGrpRange
            : "") +
      (state.args.peerSelection? CONST.log.sep01 + "ctx-selected-peers" + CONST.log.sep02 + state.args.selectedPeers :"")

    uri += (addGroupTopicState ? CONST.log.sep01 + 
      "ctx-group-topic-state" + CONST.log.sep02 + JSON.stringify(group.state.topics, groupTopicStateJsonStringifyReplacer): "")
       + CONST.log.sep01 + "sequencedActs:" + sequencedActs4Log();
  }
      
      
  $call("GET", uri, null, null, true, false);
}

// To remove unused report level from JSON string and round the values
function groupTopicStateJsonStringifyReplacer(key,value) {
  if(data.resources.map(res => res.id).includes(key)) {
    return round(value[data.reportLevels[$_("tbar-rep-lvl").value].id],2)
  } else {
    return value
  }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}



// ------------------------------------------------------------------------------------------------------
/**
 * Sets report level (i.e., progress, knowledge, etc.)
 */
function repLvlSet() {
  if (state.args.uiGridActLstMode) actLstHide();
  
  //sortMe();
  //sortOthers();
  visDo(true, true, true);
  
  log("action" + CONST.log.sep02 + "report-level-set", true);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Sets resource (i.e., switches between the All-Resources and Resource-Focus modes).
 */
function resSet(idx, doRefreshVis, doLog) {
  state.vis.resIdx = idx - 2;  // there are two entries in the combo box before the first actual resource
  if (state.vis.resIdx >= 0) {
    data.learners.sort(function (a,b) { a.state.topics[data.topics[0].id].values[getRes().id][getRepLvl().id] - b.state.topics[data.topics[0].id].values[getRes().id][getRepLvl().id]; });
  }
  
  if (state.args.uiGridActLstMode) actLstHide();
  
  if (doRefreshVis) visDo(true, true, true);
  
  if (doLog) log("action" + CONST.log.sep02 + "resource-set", true); 
}


// ------------------------------------------------------------------------------------------------------
/**
 * Because the data.topics array is used to access the actual resource values for the purpose of 
 * visualization, it is enough to sort that array.
 * 
 * [not used any more]
 */
function sortMe() {
  ui.vis.grid.me.tbar.sortByIdx  = ui.vis.grid.me.tbar.sortBy.selectedIndex;
  ui.vis.grid.me.tbar.sortDirIdx = ui.vis.grid.me.tbar.sortDir.selectedIndex;
  
  var by    = ui.vis.grid.me.tbar.sortBy.value;
  var isAsc = (ui.vis.grid.me.tbar.sortDir.value === "a");
  
  // (1) Sort:
  if (by === "-") return;
  
  else if (by === "original") {
    data.topics = [data.topics[0]].concat(isAsc ? data._rt.topicsOrd.slice(1) : data._rt.topicsOrd.slice(1).reverse());
  }
  
  else if (by === "topic") {
    var tmp = data._rt.topicsOrd.slice(1);
    tmp.sort(function (a,b) {
      if (a.name > b.name) return (isAsc ?  1 : -1);
      if (a.name < b.name) return (isAsc ? -1 :  1);
      return 0;
    });
    data.topics = [data.topics[0]].concat(tmp);
  }
  
  else {
    var tmp = data._rt.topicsOrd.slice(1);
    var me = getMe(false);
    tmp.sort(function (a,b) {
      return (isAsc
        ? me.state.topics[a.id].values[by][getRepLvl().id] - me.state.topics[b.id].values[by][getRepLvl().id]
        : me.state.topics[b.id].values[by][getRepLvl().id] - me.state.topics[a.id].values[by][getRepLvl().id]
      );
    });
    data.topics = [data.topics[0]].concat(tmp);
  }
  
  log(
    "action"    + CONST.log.sep02 + "me-sort" + CONST.log.sep01 +
    "by"        + CONST.log.sep02 + by        + CONST.log.sep01 +
    "ascending" + CONST.log.sep02 + (isAsc ? 1 : 0),
    true
  );
  
  // (2) Refresh visualization:
  visDo(true, true, true);
  
  /*
  // Example (http://bl.ocks.org/mbostock/3885705):
  var x0 = x.domain(
    data.sort(this.checked
      ? function(a, b) { return b.frequency - a.frequency; }
      : function(a, b) { return d3.ascending(a.letter, b.letter); })
      .map(function(d) { return d.letter; }))
      .copy();
  
  var transition = svg.transition().duration(750),
      delay = function(d, i) { return i * 50; };
  
  transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.letter); });
  
  transition.select(".x.axis")
      .call(xAxis)
    .selectAll("g")
      .delay(delay);
  */
}


// ------------------------------------------------------------------------------------------------------
/**
 * Sorts other learners (i.e., the rest) by the specified resource.
 * 
 * [not used any more]
 */
function sortOthers() {
  ui.vis.grid.others.tbar.sortByIdx  = ui.vis.grid.others.tbar.sortBy.selectedIndex;
  ui.vis.grid.others.tbar.sortDirIdx = ui.vis.grid.others.tbar.sortDir.selectedIndex;
  
  var by    = ui.vis.grid.others.tbar.sortBy.value;
  var isAsc = (ui.vis.grid.others.tbar.sortDir.value === "a");
  
  data.learners.sort(function (a,b) {
    return (isAsc
      ? a.state.topics[data.topics[0].id].values[by][getRepLvl().id] - b.state.topics[data.topics[0].id].values[by][getRepLvl().id]
      : b.state.topics[data.topics[0].id].values[by][getRepLvl().id] - a.state.topics[data.topics[0].id].values[by][getRepLvl().id]
    );
  });
  
  log(
    "action"    + CONST.log.sep02 + "others-sort" + CONST.log.sep01 +
    "by"        + CONST.log.sep02 + by            + CONST.log.sep01 +
    "ascending" + CONST.log.sep02 + (isAsc ? 1 : 0),
    true
  );
  
  visDo(false, false, true);
}


// ------------------------------------------------------------------------------------------------------
/**
 * These query-string arguments need to be known BEFORE the data has been requested from the server.
 */
function stateArgsSet01() {
  // Session:
  state.curr.usr = qs.usr;
  state.curr.grp = qs.grp;
  state.curr.sid = qs.sid;
  state.curr.cid = qs.cid;
  
  // Data:
  state.args.dataLive             = (qs["data-live"] === "0" ? false : true);
  state.args.dataTopNGrp          = (isNaN(parseInt(qs["data-top-n-grp"])) || parseInt(qs["data-top-n-grp"]) <= 0 ? CONST.defTopN : parseInt(qs["data-top-n-grp"]));
  state.args.dataReqOtherLearners = (qs["data-req-other-learners"] === "1" ? true : false);
  
  state.args.removeZeroProgressUsers = (qs["ui-remove-zero-progress"]  !== undefined ? qs["ui-remove-zero-progress"] : "false");
  state.args.completedSurveyId = (qs["surveyId"]  !== undefined ? qs["surveyId"] : undefined);
  if(state.args.completedSurveyId) {
    var surveyTrackUrl = CONST.uriServer + "TrackSurveyAction?usr=" + state.curr.usr + "&grp=" + state.curr.grp + "&surveyId=" + state.args.completedSurveyId + "&action=complete";
    $call("GET", surveyTrackUrl, null, null, true, false);
  }
}


// ------------------------------------------------------------------------------------------------------
/**
 * These query-string arguments need (or can) to be known AFTER the data has been requested from the
 * server.
 */
function stateArgsSet02() {
  // Default values:
  state.args.defValRepLvl           = qs["def-val-rep-lvl-id"];
  state.args.defValGrpIdx           = parseInt(qs["def-val-grp-idx"]);
  state.args.defValResId            = qs["def-val-res-id"];
  
  // UI: Toolbar:
  state.args.uiTBarVis              = (qs["ui-tbar-vis"]            === "0" ? false : true);

  state.args.uiTBarModeVis          = (qs["ui-tbar-mode-vis"]       === "0" ? false : true);
  state.args.uiTBarModeGrpChk       = (qs["ui-tbar-mode-grp-chk"]   === "0" ? false : true);
  state.args.uiTBarRepLvlVis        = (qs["ui-tbar-rep-lvl-vis"]    === "0" ? false : true);
  state.args.uiTBarTopicSizeVis     = (qs["ui-tbar-topic-size-vis"] === "0" ? false : true);
  state.args.uiTBarGrpVis           = (qs["ui-tbar-grp-vis"]        === "0" ? false : true);
  state.args.uiTBarResVis           = (qs["ui-tbar-res-vis"]        === "0" ? false : true);
  
  // UI: Grids:
  state.args.uiGridAllHeadMeVis     = (qs["ui-grid-all-head-me-vis"]     === "0" ? false : true);
  state.args.uiGridAllHeadMeGrpVis  = (qs["ui-grid-all-head-me-grp-vis"] === "0" ? false : true);
  state.args.uiGridAllHeadGrpVis    = (qs["ui-grid-all-head-grp-vis"]    === "0" ? false : true);
  state.args.uiGridAllHeadOthersVis = (qs["ui-grid-all-head-others-vis"] === "0" ? false : true);
  
  state.args.uiGridOneHeadMeVis     = (qs["ui-grid-one-head-me-vis"]     === "0" ? false : true);
  state.args.uiGridOneHeadOthersVis = (qs["ui-grid-one-head-others-vis"] === "0" ? false : true);
  
  state.args.uiGridMeVis            = (qs["ui-grid-me-vis"]     === "0" ? false : true);
  state.args.uiGridMeGrpVis         = (qs["ui-grid-me-grp-vis"] === "0" ? false : true);
  state.args.uiGridGrpVis           = (qs["ui-grid-grp-vis"]    === "0" ? false : true);
  state.args.uiGridOthersVis        = (qs["ui-grid-others-vis"] === "0" ? false : true);
  state.args.uiGridDynamicOthersVis = (qs["ui-grid-dynamic-others-vis"] === "0" ? false : true);
  
  state.args.uiGridTimelineVis      = (qs["ui-grid-timeline-vis"]  === "0" ? false : true);
  //state.args.uiGridTimelineTitle    = "Week";
  state.args.uiGridTimelineTitle    = "";
  state.args.uiGridActLstMode       = (qs["ui-grid-act-lst-mode"]  === "0" ? false : true);
  
  state.args.uiShowHelp             = (qs["ui-show-help"]  === "1" ? true : false);
  state.args.uiShowContentHelp      = (qs["ui-show-content-help"]  === "1" ? true : false);
  //Bar Chart
  state.args.uiShowBarChart      	= (qs["ui-show-barchart"]  === "0" ? false : true);
  //Color Scale next to help button
   state.args.uiShowColorScale      = (qs["ui-show-colorscale"]  === "1" ? true : false);
  //MG Title
  state.args.mgTitle				= "Mastery Grids";
  
  state.args.uiOnlyMeRowActLst = false
  
  state.args.uiIncenCheck			= (qs["ui-incen-check"]  === "1" ? true : false);

  state.args.uiGradualTopicOpening = (qs["ui-gradual-topic-opening"]  !== undefined ? qs["ui-gradual-topic-opening"] : false);
  state.args.uiExtraParamFile = (qs["ui-extra-param-file"]  !== undefined ? qs["ui-extra-param-file"] : undefined);
  state.args.uiLockTopicAfterDueDate = false

  state.args.dbqaExplanations = false

  state.args.requiredPreSurveys = []
  state.args.requiredPostSurveys = []

  //Default value for controllable SC will be true (for making it compatible with previous and already currently running controllable SC studies)
  state.args.controlSC			= true;//(qs["ui-incen-check"]  === "1" ? true : false);
  state.args.adaptiveSC			= false;
  state.args.slidingControlSC  = false;
  state.args.peerSelection = false;
  state.args.uiComparisonOption = "sc-option-slider"
  state.args.peerSelectionConsent = false
  state.args.practiceGoalSC = false

  state.args.hasMiddleComparisonGroup = data.groups.map(e=>e.name).includes("Middle third")

  
  
  // @@@@
  // TODO overwrite parameters with the ones in the data: 
  // data.vis.ui.params.group and data.vis.ui.params.user (in this order)
  
  // Overwrite Parameters defined for the group 
  if(data.vis.ui.params.group){   
      state.args.defValRepLvl           = (data.vis.ui.params.group.defValRepLvlId != undefined ? data.vis.ui.params.group.defValRepLvlId : state.args.defValRepLvl);
      state.args.defValGrpIdx           = (data.vis.ui.params.group.defValGrpIdx != undefined ? data.vis.ui.params.group.defValGrpIdx : state.args.defValGrpIdx);
      state.args.defValResId            = (data.vis.ui.params.group.defValResId != undefined ? data.vis.ui.params.group.defValResId : state.args.defValResId);
      state.args.uiTBarVis              = (data.vis.ui.params.group.uiTBarVis != undefined ? data.vis.ui.params.group.uiTBarVis : state.args.uiTBarVis);
      state.args.uiTBarModeVis          = (data.vis.ui.params.group.uiTBarModeVis != undefined ? data.vis.ui.params.group.uiTBarModeVis : state.args.uiTBarModeVis);
      state.args.uiTBarModeGrpChk       = (data.vis.ui.params.group.uiTBarModeGrpChk != undefined ? data.vis.ui.params.group.uiTBarModeGrpChk : state.args.uiTBarModeGrpChk);

      state.args.uiTBarRepLvlVis        = (data.vis.ui.params.group.uiTBarRepLvlVis != undefined ? data.vis.ui.params.group.uiTBarRepLvlVis : state.args.uiTBarRepLvlVis);
      state.args.uiTBarTopicSizeVis     = (data.vis.ui.params.group.uiTBarTopicSizeVis != undefined ? data.vis.ui.params.group.uiTBarTopicSizeVis : state.args.uiTBarTopicSizeVis);
      state.args.uiTBarGrpVis           = (data.vis.ui.params.group.uiTBarGrpVis != undefined ? data.vis.ui.params.group.uiTBarGrpVis : state.args.uiTBarGrpVis);
      state.args.uiTBarResVis           = (data.vis.ui.params.group.uiTBarResVis != undefined ? data.vis.ui.params.group.uiTBarResVis : state.args.uiTBarResVis);
      state.args.uiGridAllHeadMeVis     = (data.vis.ui.params.group.uiGridAllHeadMeVis != undefined ? data.vis.ui.params.group.uiGridAllHeadMeVis : state.args.uiGridAllHeadMeVis);
      state.args.uiGridAllHeadMeGrpVis  = (data.vis.ui.params.group.uiGridAllHeadMeGrpVis != undefined ? data.vis.ui.params.group.uiGridAllHeadMeGrpVis : state.args.uiGridAllHeadMeGrpVis);
      state.args.uiGridAllHeadGrpVis    = (data.vis.ui.params.group.uiGridAllHeadGrpVis != undefined ? data.vis.ui.params.group.uiGridAllHeadGrpVis : state.args.uiGridAllHeadGrpVis);
      state.args.uiGridAllHeadOthersVis = (data.vis.ui.params.group.uiGridAllHeadOthersVis != undefined ? data.vis.ui.params.group.uiGridAllHeadOthersVis : state.args.uiGridAllHeadOthersVis);
      state.args.uiGridOneHeadMeVis     = (data.vis.ui.params.group.uiGridOneHeadMeVis != undefined ? data.vis.ui.params.group.uiGridOneHeadMeVis : state.args.uiGridOneHeadMeVis);
      state.args.uiGridOneHeadOthersVis = (data.vis.ui.params.group.uiGridOneHeadOthersVis != undefined ? data.vis.ui.params.group.uiGridOneHeadOthersVis : state.args.uiGridOneHeadOthersVis);
      state.args.uiGridMeVis            = (data.vis.ui.params.group.uiGridMeVis != undefined ? data.vis.ui.params.group.uiGridMeVis : state.args.uiGridMeVis);
      state.args.uiGridMeGrpVis         = (data.vis.ui.params.group.uiGridMeGrpVis != undefined ? data.vis.ui.params.group.uiGridMeGrpVis : state.args.uiGridMeGrpVis);
      state.args.uiGridGrpVis           = (data.vis.ui.params.group.uiGridGrpVis != undefined ? data.vis.ui.params.group.uiGridGrpVis : state.args.uiGridGrpVis);
      state.args.uiGridOthersVis        = (data.vis.ui.params.group.uiGridOthersVis != undefined ? data.vis.ui.params.group.uiGridOthersVis : state.args.uiGridOthersVis);
      state.args.uiGridDynamicOthersVis = (data.vis.ui.params.group.uiGridDynamicOthersVis != undefined ? data.vis.ui.params.group.uiGridDynamicOthersVis : state.args.uiGridDynamicOthersVis);
      state.args.uiGridTimelineVis      = (data.vis.ui.params.group.uiGridTimelineVis != undefined ? data.vis.ui.params.group.uiGridTimelineVis : state.args.uiGridTimelineVis);
      state.args.uiGridTimelineTitle    = "";
      state.args.uiGridActLstMode       = (data.vis.ui.params.group.uiGridActLstMode != undefined ? data.vis.ui.params.group.uiGridActLstMode : state.args.uiGridActLstMode);
      state.args.uiShowHelp             = (data.vis.ui.params.group.uiShowHelp != undefined ? data.vis.ui.params.group.uiShowHelp : state.args.uiShowHelp);
      state.args.uiShowContentHelp      = (data.vis.ui.params.group.uiShowContentHelp != undefined ? data.vis.ui.params.group.uiShowContentHelp : state.args.uiShowContentHelp);
	    state.args.uiShowBarChart         = (data.vis.ui.params.group.uiShowBarChart != undefined ? data.vis.ui.params.group.uiShowBarChart : state.args.uiShowBarChart);
	    state.args.uiShowColorScale		    = (data.vis.ui.params.group.uiShowColorScale != undefined ? data.vis.ui.params.group.uiShowColorScale : state.args.uiShowColorScale);
      state.args.uiIncenCheck			      = (data.vis.ui.params.group.uiIncenCheck != undefined ? data.vis.ui.params.group.uiIncenCheck : state.args.uiIncenCheck);
      state.args.uiGradualTopicOpening     = (data.vis.ui.params.group.uiGradualTopicOpening != undefined ? data.vis.ui.params.group.uiGradualTopicOpening : state.args.uiGradualTopicOpening);
      state.args.uiExtraParamFile     = (data.vis.ui.params.group.uiExtraParamFile != undefined ? data.vis.ui.params.group.uiExtraParamFile : state.args.uiExtraParamFile);
      state.args.uiLockTopicAfterDueDate       = (data.vis.ui.params.group.uiLockTopicAfterDueDate != undefined ? data.vis.ui.params.group.uiLockTopicAfterDueDate : state.args.uiLockTopicAfterDueDate);
      state.args.uiOnlyMeRowActLst      = (data.vis.ui.params.group.uiOnlyMeRowActLst != undefined ? data.vis.ui.params.group.uiOnlyMeRowActLst : state.args.uiOnlyMeRowActLst);
      
      state.args.mgTitle				        = (data.vis.ui.params.group.mgTitle != undefined ? data.vis.ui.params.group.mgTitle :  state.args.mgTitle);
      state.args.controlSC				      = (data.vis.ui.params.group.controlSC != undefined ? data.vis.ui.params.group.controlSC :  state.args.controlSC);
      state.args.adaptiveSC				      = (data.vis.ui.params.group.adaptiveSC != undefined ? data.vis.ui.params.group.adaptiveSC :  state.args.adaptiveSC);
      state.args.slidingControlSC		  = (data.vis.ui.params.group.slidingControlSC != undefined ? data.vis.ui.params.group.slidingControlSC :  state.args.slidingControlSC);
      state.args.practiceGoalSC		  = (data.vis.ui.params.group.practiceGoalSC != undefined ? data.vis.ui.params.group.practiceGoalSC :  state.args.practiceGoalSC);

      state.args.peerSelection          = (data.vis.ui.params.group.peerSelection != undefined ? data.vis.ui.params.group.peerSelection :  state.args.peerSelection);
      state.args.grpToCompare           = (data.vis.ui.params.group.grpToCompare != undefined ? data.vis.ui.params.group.grpToCompare :  null);	
      state.args.compGrpRange           = (data.vis.ui.params.group.compGrpRange != undefined ? data.vis.ui.params.group.compGrpRange :  null);	
      state.args.selectedPeers          = (data.vis.ui.params.group.selectedPeers != undefined ? data.vis.ui.params.group.selectedPeers :  "none");	

      state.args.dbqaExplanations       = (data.vis.ui.params.group.dbqa_exp != undefined ? data.vis.ui.params.group.dbqa_exp : state.args.dbqaExplanations);

      state.args.requiredPreSurveys    = (data.vis.ui.params.group.requiredPreSurveys != undefined ? data.vis.ui.params.group.requiredPreSurveys : state.args.requiredPreSurveys);
      state.args.requiredPostSurveys    = (data.vis.ui.params.group.requiredPostSurveys != undefined ? data.vis.ui.params.group.requiredPostSurveys : state.args.requiredPostSurveys);
  }
  if(data.vis.ui.params.user){
      state.args.defValRepLvl           = (data.vis.ui.params.user.defValRepLvlId != undefined ? data.vis.ui.params.user.defValRepLvlId : state.args.defValRepLvl);
      state.args.defValGrpIdx           = (data.vis.ui.params.user.defValGrpIdx != undefined ? data.vis.ui.params.user.defValGrpIdx : state.args.defValGrpIdx);
      state.args.defValResId            = (data.vis.ui.params.user.defValResId != undefined ? data.vis.ui.params.user.defValResId : state.args.defValResId);
      state.args.uiTBarVis              = (data.vis.ui.params.user.uiTBarVis != undefined ? data.vis.ui.params.user.uiTBarVis : state.args.uiTBarVis);
      state.args.uiTBarModeVis          = (data.vis.ui.params.user.uiTBarModeVis != undefined ? data.vis.ui.params.user.uiTBarModeVis : state.args.uiTBarModeVis);
      state.args.uiTBarModeGrpChk       = (data.vis.ui.params.user.uiTBarModeGrpChk != undefined ? data.vis.ui.params.user.uiTBarModeGrpChk : state.args.uiTBarModeGrpChk);
      
      state.args.uiTBarRepLvlVis        = (data.vis.ui.params.user.uiTBarRepLvlVis != undefined ? data.vis.ui.params.user.uiTBarRepLvlVis : state.args.uiTBarRepLvlVis);
      state.args.uiTBarTopicSizeVis     = (data.vis.ui.params.user.uiTBarTopicSizeVis != undefined ? data.vis.ui.params.user.uiTBarTopicSizeVis : state.args.uiTBarTopicSizeVis);
      state.args.uiTBarGrpVis           = (data.vis.ui.params.user.uiTBarGrpVis != undefined ? data.vis.ui.params.user.uiTBarGrpVis : state.args.uiTBarGrpVis);
      state.args.uiTBarResVis           = (data.vis.ui.params.user.uiTBarResVis != undefined ? data.vis.ui.params.user.uiTBarResVis : state.args.uiTBarResVis);
      state.args.uiGridAllHeadMeVis     = (data.vis.ui.params.user.uiGridAllHeadMeVis != undefined ? data.vis.ui.params.user.uiGridAllHeadMeVis : state.args.uiGridAllHeadMeVis);
      state.args.uiGridAllHeadMeGrpVis  = (data.vis.ui.params.user.uiGridAllHeadMeGrpVis != undefined ? data.vis.ui.params.user.uiGridAllHeadMeGrpVis : state.args.uiGridAllHeadMeGrpVis);
      state.args.uiGridAllHeadGrpVis    = (data.vis.ui.params.user.uiGridAllHeadGrpVis != undefined ? data.vis.ui.params.user.uiGridAllHeadGrpVis : state.args.uiGridAllHeadGrpVis);
      state.args.uiGridAllHeadOthersVis = (data.vis.ui.params.user.uiGridAllHeadOthersVis != undefined ? data.vis.ui.params.user.uiGridAllHeadOthersVis : state.args.uiGridAllHeadOthersVis);
      state.args.uiGridOneHeadMeVis     = (data.vis.ui.params.user.uiGridOneHeadMeVis != undefined ? data.vis.ui.params.user.uiGridOneHeadMeVis : state.args.uiGridOneHeadMeVis);
      state.args.uiGridOneHeadOthersVis = (data.vis.ui.params.user.uiGridOneHeadOthersVis != undefined ? data.vis.ui.params.user.uiGridOneHeadOthersVis : state.args.uiGridOneHeadOthersVis);
      state.args.uiGridMeVis            = (data.vis.ui.params.user.uiGridMeVis != undefined ? data.vis.ui.params.user.uiGridMeVis : state.args.uiGridMeVis);
      state.args.uiGridMeGrpVis         = (data.vis.ui.params.user.uiGridMeGrpVis != undefined ? data.vis.ui.params.user.uiGridMeGrpVis : state.args.uiGridMeGrpVis);
      state.args.uiGridGrpVis           = (data.vis.ui.params.user.uiGridGrpVis != undefined ? data.vis.ui.params.user.uiGridGrpVis : state.args.uiGridGrpVis);
      state.args.uiGridOthersVis        = (data.vis.ui.params.user.uiGridOthersVis != undefined ? data.vis.ui.params.user.uiGridOthersVis : state.args.uiGridOthersVis);
      state.args.uiGridDynamicOthersVis = (data.vis.ui.params.user.uiGridDynamicOthersVis != undefined ? data.vis.ui.params.user.uiGridDynamicOthersVis : state.args.uiGridDynamicOthersVis);
      state.args.uiGridTimelineVis      = (data.vis.ui.params.user.uiGridTimelineVis != undefined ? data.vis.ui.params.user.uiGridTimelineVis : state.args.uiGridTimelineVis);
      state.args.uiGridTimelineTitle    = "";
      state.args.uiGridActLstMode       = (data.vis.ui.params.user.uiGridActLstMode != undefined ? data.vis.ui.params.user.uiGridActLstMode : state.args.uiGridActLstMode);
      state.args.uiShowHelp             = (data.vis.ui.params.user.uiShowHelp != undefined ? data.vis.ui.params.user.uiShowHelp : state.args.uiShowHelp); 
      state.args.uiShowContentHelp      = (data.vis.ui.params.user.uiShowContentHelp != undefined ? data.vis.ui.params.user.uiShowContentHelp : state.args.uiShowContentHelp);    
	    state.args.uiShowBarChart         = (data.vis.ui.params.user.uiShowBarChart != undefined ? data.vis.ui.params.user.uiShowBarChart : state.args.uiShowBarChart);  
	    state.args.uiShowColorScale		    = (data.vis.ui.params.user.uiShowColorScale != undefined ? data.vis.ui.params.user.uiShowColorScale : state.args.uiShowColorScale);	 
      state.args.uiIncenCheck			      = (data.vis.ui.params.user.uiIncenCheck != undefined ? data.vis.ui.params.user.uiIncenCheck : state.args.uiIncenCheck);
      state.args.uiGradualTopicOpening     = (data.vis.ui.params.user.uiGradualTopicOpening != undefined ? data.vis.ui.params.user.uiGradualTopicOpening : state.args.uiGradualTopicOpening);
      state.args.uiExtraParamFile     = (data.vis.ui.params.user.uiExtraParamFile != undefined ? data.vis.ui.params.user.uiExtraParamFile : state.args.uiExtraParamFile);
      state.args.uiLockTopicAfterDueDate     = (data.vis.ui.params.user.uiLockTopicAfterDueDate != undefined ? data.vis.ui.params.user.uiLockTopicAfterDueDate : state.args.uiLockTopicAfterDueDate);
      state.args.uiOnlyMeRowActLst      = (data.vis.ui.params.user.uiOnlyMeRowActLst != undefined ? data.vis.ui.params.user.uiOnlyMeRowActLst : state.args.uiOnlyMeRowActLst);

	    state.args.mgTitle				        = (data.vis.ui.params.user.mgTitle != undefined ? data.vis.ui.params.user.mgTitle :  state.args.mgTitle);	  
      state.args.controlSC              = (data.vis.ui.params.user.controlSC != undefined ? data.vis.ui.params.user.controlSC :  state.args.controlSC);	
      state.args.adaptiveSC              = (data.vis.ui.params.user.adaptiveSC != undefined ? data.vis.ui.params.user.adaptiveSC :  state.args.adaptiveSC);	
      state.args.slidingControlSC       = (data.vis.ui.params.user.slidingControlSC != undefined ? data.vis.ui.params.user.slidingControlSC :  state.args.slidingControlSC);	  
      state.args.practiceGoalSC       = (data.vis.ui.params.user.practiceGoalSC != undefined ? data.vis.ui.params.user.practiceGoalSC :  state.args.practiceGoalSC);	  

      state.args.peerSelection          = (data.vis.ui.params.user.peerSelection != undefined ? data.vis.ui.params.user.peerSelection :  state.args.peerSelection);
      state.args.uiComparisonOption     = (data.vis.ui.params.user.uiComparisonOption != undefined ? data.vis.ui.params.user.uiComparisonOption:  state.args.uiComparisonOption);

      state.args.peerSelectionConsent     = (data.vis.ui.params.user.peerSelectionConsent != undefined ? (data.vis.ui.params.user.peerSelectionConsent =='true'):  state.args.peerSelectionConsent);

      state.args.grpToCompare           = (data.vis.ui.params.user.grpToCompare != undefined ? data.vis.ui.params.user.grpToCompare :  null);	
      state.args.compGrpRange           = (data.vis.ui.params.user.compGrpRange != undefined ? data.vis.ui.params.user.compGrpRange :  null);	
      state.args.selectedPeers          = (data.vis.ui.params.user.selectedPeers != undefined ? data.vis.ui.params.user.selectedPeers :  "none");

      state.args.dbqaExplanations       = (data.vis.ui.params.user.dbqa_exp != undefined ? data.vis.ui.params.user.dbqa_exp : state.args.dbqaExplanations);

      state.args.requiredPreSurveys    = (data.vis.ui.params.user.requiredPreSurveys != undefined ? data.vis.ui.params.user.requiredPreSurveys : state.args.requiredPreSurveys);
      state.args.requiredPostSurveys    = (data.vis.ui.params.user.requiredPostSurveys != undefined ? data.vis.ui.params.user.requiredPostSurveys : state.args.requiredPostSurveys);
    }

  
  state.args.dataReqOtherLearners = false //This is to revert the initial query parameter. TODO: need to split this parameter to have another one for Load the rest of learners option.
  
  CONST.comparison.grpActive        = state.args.uiGridGrpVis;
  CONST.comparison.meGrpActive      = state.args.uiGridMeGrpVis;
  CONST.comparison.othersActive     = state.args.uiGridOthersVis;
  
  if(!state.args.uiTBarModeGrpChk){
      state.args.uiGridGrpVis = false;
      state.args.uiGridMeGrpVis = false;
      state.args.uiGridOthersVis = false;
  }

  if(state.args.practiceGoalSC) {
    const goalMessages = [
      t('practice_goal.random.0'),
      t('practice_goal.random.1'),
      t('practice_goal.random.2'),
      t('practice_goal.random.3'),
      t('practice_goal.random.4')
      ];

    // Randomly select one message
    CONST.vis.practiceGoalMessage = goalMessages[Math.floor(Math.random() * goalMessages.length)];
  }
  
}


// ------------------------------------------------------------------------------------------------------
/**
 * Loads the app state from cookies.
 */
function stateLoad() {
  var c = $.cookies.get(CONST.appName);
  if (!c) return;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Loads the app state using cookies.
 */
function stateSave() {
  var date = new Date();
  date.setTime(date.getTime() + (CONST.cookies.days*24*60*60*1000));
  
  $.cookies.set(
    CONST.appName,
    {
      // key: value
    },
    { expiresAt: date }
  );
}


// ------------------------------------------------------------------------------------------------------
function svgGetMaxTextBB(T) {
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  document.body.appendChild(svg);
  
  var res = { width:-1, height:-1 };
  for (var i=0, ni=T.length; i < ni; i++) {
    var txt = document.createElementNS(ns, "text");
    txt.appendChild(document.createTextNode(T[i]));
    svg.appendChild(txt);
    
    var bb = txt.getBBox();
    if (bb.width  > res.width ) res.width  = bb.width ;
    if (bb.height > res.height) res.height = bb.height;
  }
  
  document.body.removeChild(svg);
  
  return res;
}


// ------------------------------------------------------------------------------------------------------
function topicSizeSet(idx, attr) {
  if (idx === state.vis.topicSize.idx) return;
  
  state.vis.topicSize.idx  = idx;
  state.vis.topicSize.attr = attr;
  
  if (state.args.uiGridActLstMode) actLstHide();
  
  visDo(true, true, true);
  
  log("action" + CONST.log.sep02 + "topic-size-set", true);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Augments the data received from the server (and stored in the 'data' global variables) by adding 
 * the following things to it:
 * 
 *   - The "Average" topic being the average over all actual topics (an extra grid column)
 *   - The "Average" resource being the per-topic average over all actual resources (an extra grid row)
 * 
 * Note that this is the function which should be inspected first in the case the protocol changes.  I 
 * won't get into the specifics of why I choose to do a questionable thing and add stuff to the actual 
 * data object.  Suffice to say that it makes visualization much much easier later on.
 */
function visAugmentData() {
  // (1) Add the "Average" topic:
  var newTopic = { id: "AVG", name: t('grid.overall') };
  
  for (var i=0, ni=data.vis.topicSizeAttr.length; i < ni; i++) {
    newTopic[data.vis.topicSizeAttr[i]] = 0.5;
  }
  
  data.topics.splice(0, 0, newTopic);
  visAugmentData_addAvgTopic(data.learners);
  visAugmentData_addAvgTopic(data.groups);
  
  // (2) Add the "Average" resource:
  data.resources.splice(0, 0, { id: "AVG", name: t('grid.overall') });
  visAugmentData_addAvgRes(data.learners);
  visAugmentData_addAvgRes(data.groups);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Add the average topic to each element of the list supplied.  Elements of that list should contain the 
 * state object as defined in the protocol.
 */
function visAugmentData_addAvgTopic(lst) {

  var resource_topic_length = {}
  
  data.resources.forEach(resource => {
    if(resource.id !== "AVG" ) {
      resource_topic_length[resource.id] = data.topics.filter(topic => (topic.id !== "AVG" &&topic.activities)?topic.activities[resource.id].length > 0:false).length
    }
  })

  for (var iElem=0, nElem=lst.length; iElem < nElem; iElem++) {
    var elem = lst[iElem];
    var newTopic = { values: {} };
    
    // (1) Sum up over topics per resource per report level:
    for (var iTopic=0, nTopic=data.topics.length; iTopic < nTopic; iTopic++) {
      var topic = data.topics[iTopic];
      if (topic.id === "AVG") continue;
      
      for (var iRes=0, nRes=data.resources.length; iRes < nRes; iRes++) {
        var res = data.resources[iRes];
        if (res.id === "AVG") continue;
      
        if (newTopic.values[res.id] == undefined) newTopic.values[res.id] = {};
        
        for (var iRepLvl=0, nRepLvl=data.reportLevels.length; iRepLvl < nRepLvl; iRepLvl++) {
          var repLvl = data.reportLevels[iRepLvl];
          if (!newTopic.values[res.id][repLvl.id]) newTopic.values[res.id][repLvl.id] = 0;
          
          newTopic.values[res.id][repLvl.id] += elem.state.topics[topic.id].values[res.id][repLvl.id];
        }
      }
    }
    
    // (2) Divide by the number of topics:
    for (var iRes=0, nRes=data.resources.length; iRes < nRes; iRes++) {
      var res = data.resources[iRes];
      if (res.id === "AVG") continue;
      
      for (var iRepLvl=0, nRepLvl=data.reportLevels.length; iRepLvl < nRepLvl; iRepLvl++) {
        var repLvl = data.reportLevels[iRepLvl];
        
        newTopic.values[res.id][repLvl.id] /= resource_topic_length[res.id];
      }
    }
    
    // (3) Associate with the learner:
    elem.state.topics["AVG"] = newTopic;
  }
}


// ------------------------------------------------------------------------------------------------------
/**
 * Add the average resource to each element of the list supplied.  Elements of that list should contain the 
 * state object as defined in the protocol.
 */
function visAugmentData_addAvgRes(lst) {
  for (var iElem=0, nElem=lst.length; iElem < nElem; iElem++) {
    var elem = lst[iElem];
    
    for (var iTopic=0, nTopic=data.topics.length; iTopic < nTopic; iTopic++) {
      var topic = data.topics[iTopic];
      var newRes = {};
      // if the overall value is available in the server data, use this value
      if(elem.state.topics[topic.id].overall){
          //alert(elem.state.topics[topic.id].overall["p"]);
          for (var iRepLvl=0, nRepLvl=data.reportLevels.length; iRepLvl < nRepLvl; iRepLvl++) {
              var repLvl = data.reportLevels[iRepLvl];
              newRes[repLvl.id] = elem.state.topics[topic.id].overall[repLvl.id];   
          }
      }else{ // compute the overall by averaging resource level averages
          // (1) Sum up over resources per report level:
          for (var iRes=0, nRes=data.resources.length; iRes < nRes; iRes++) {
            var res = data.resources[iRes];
            if (res.id === "AVG") continue;
            
            for (var iRepLvl=0, nRepLvl=data.reportLevels.length; iRepLvl < nRepLvl; iRepLvl++) {
              var repLvl = data.reportLevels[iRepLvl];
              if (newRes[repLvl.id] == undefined) newRes[repLvl.id] = 0;
              
              newRes[repLvl.id] += elem.state.topics[topic.id].values[res.id][repLvl.id];
            }
          }
          
          // (2) Divide by the number of resources:
          for (var iRepLvl=0, nRepLvl=data.reportLevels.length; iRepLvl < nRepLvl; iRepLvl++) {
            var repLvl = data.reportLevels[iRepLvl];
            
            newRes[repLvl.id] /= (data.resources.length - 1);  // -1 to exclude the "Average" resource which should have already been added
          }
          
      }
          
      
      // (3) Associate with the topic:
      elem.state.topics[topic.id].values["AVG"] = newRes;
    }
  }
}


// ------------------------------------------------------------------------------------------------------
/**
 * Makes the entire visualization happen. The "me" and "group" part can be refreshed independently 
 * depending on the arguments. This is useful because only the "me" part should be refreshed upon the 
 * learner completing an activity.  Note, that here "me" and "group" do not denote individual grids but
 * rather those grids that "me" (i.e., the current learner) or the "group" (i.e., everyone but me) are 
 * involved in.  Same goes for "others."
 */
function visDo(doMe, doGrp, doOthers) {
  var scroll = { x: window.scrollX, y: window.scrollY };
  
  // (1) Reset:
  if (doMe)     $removeChildren(ui.vis.grid.cont.me);
  if (doGrp)    $removeChildren(ui.vis.grid.cont.grp);
  if (doOthers) $removeChildren(ui.vis.grid.cont.others);
  
  state.vis.grid.cellIdxMax = 0;
  state.vis.grid.cellIdxSel = -1;
  state.vis.grid.cellSel    = null;
  
  var me        = getMe(false);
  var meIdx     = getMeInGrpIdx();
  var grp       = getGrp();
  var others    = getOthers();
  var topic     = getTopic();
  var res       = getRes();
  var resNames  = $map(function (x) { return x.name; }, data.resources);
  var topicMaxW = svgGetMaxTextBB($.map(data.topics, function (x) { return x.name; })).width;
  
  
  //if($_("tbar-grp").selectedIndex > 0){
  if($("input[name=tbar-grp]:checked").val()){
      var group_name = getComparisonGroupName();
      if(group_name == "Class Average") {
        othersTitle = t('title.others');
      } else {
        group_name = group_name.replace(/group/i, '');
        othersTitle = t('grid.ranked_list_group', { groupName: group_name,
                                                    comparison_metric: get_comparison_metric()  
                                                  });

        groupTitle = t('grid.students_in_group', { groupName: group_name });
      } 
  }
  
  // (2) Grids:
  // (2.1) Prepare "Me" toolbar:
  var tbarMe = null;
  
  // (2.2) Prepare "Learners in group" toolbar:
  var tbarOther = null;
 
  // (2.3) Visualize:
  var fnVisGenGridData = null;
  
  // (2.3.1) All resources:
  if (state.vis.resIdx < 0) {
    fnVisGenGridData = (state.args.uiGridActLstMode || topic === null ? visGenGridDataAllRes : visGenGridDataAllRes_act);
    // @@@@
    switch (state.vis.mode) { // group / individual
      // (2.3.1.1) Group comparison mode:
      case CONST.vis.mode.grp:
        // (a) Me + Me and group + Group:
        if (doMe && state.args.uiGridMeVis) {
          var title = getMeGridTitle(state.args.uiGridAllHeadMeVis, topic);
          visGenGrid      (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "me",        me,           null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);                                                    }, data.resources), true,  true ), CONST.vis.gridAbs, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true, "all-res-me" );
        }
        
        if ((doMe || doGrp) && state.args.uiGridMeGrpVis) {
          var title = (state.args.uiGridAllHeadMeGrpVis ? t('grid.me_versus_group') : null);
          visGenGrid      (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "mevsgrp", me,           grp,      [],          $map(function (x) { return CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources), false, true ), CONST.vis.gridDev, title, null,                         false, false,                       0,                           state.vis.grid.cornerRadius, topicMaxW,         state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barDevMini, resNames, true,  false,                                                          false, true , "all-res-mevsgrp" );
        }
        
        if (doGrp && state.args.uiGridGrpVis) {
          var title = (state.args.uiGridAllHeadGrpVis ? t('grid.group_with_title',{groupTitle:groupTitle}): null);
          visGenGrid      (ui.vis.grid.cont.grp,    fnVisGenGridData(null,     "grp",       grp,          null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]);                                                   }, data.resources), false, true ), CONST.vis.gridAbs, title, null,                         false, false,                       0,                           state.vis.grid.cornerRadius, topicMaxW,         state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  false,                                                          false, true, "all-res-grp" );
        }
        
        // (b) Others:
        if (doOthers && state.args.uiGridOthersVis) {
          $($$input("button", ui.vis.grid.cont.others, "btn-others-load", null, (state.args.dataReqOtherLearners ? t('ranked_list.hide', {metric:get_comparison_metric()}): t('ranked_list.show', {metric:get_comparison_metric()})))).button().click(loadDataOthers);
          if (state.args.dataReqOtherLearners) {
            for (var i=0, ni=others.length; i < ni; i++) {
              var other = others[i];
              var title = getOthersGridTitle(state.args.uiGridAllHeadOthersVis && i === 0, othersTitle, meIdx, others.length);
              
              if (other.id === me.id) {
                colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources);
              }
              else {
                colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]); }, data.resources);
              }
              visGenGrid    (ui.vis.grid.cont.others, fnVisGenGridData(null,     "others",    other,        null,     [],          colorScales,                                                                                                                                                         false, true ), CONST.vis.gridAbs, title, (i === 0 ? tbarOther : null), false, (i === 0 && topic === null), CONST.vis.otherIndCellH.def, 0,                           topicMaxW, state.vis.grid.xLblAngle,  0, false, null,      null,                resNames, true,  false,                                                          false, true, null );
            }
          }
          
        }
        break;
      
      // (2.3.1.1) Individual comparison mode:
      case CONST.vis.mode.ind:
        // (a) My progress:
        if (doMe && state.args.uiGridMeVis) {
          var title = getMeGridTitle(state.args.uiGridAllHeadMeVis, topic);
          visGenGrid     (ui.vis.grid.cont.me,      fnVisGenGridData(null,     "me",        me,           null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources), true,  true ), CONST.vis.gridAbs, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true, null );
        }
        
        // (b) Others:
        if (doOthers && state.args.uiGridOthersVis) {
          for (var i=0, ni=others.length; i < ni; i++) {
            var other = others[i];
            var title = getOthersGridTitle(state.args.uiGridAllHeadOthersVis && i === 0, othersTitle, meIdx, others.length);
            visGenGrid    (ui.vis.grid.cont.others, fnVisGenGridData(null,     "others",    other,        null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources), false, true ), CONST.vis.gridAbs, title, (i === 0 ? tbarOther : null), false, false,                       0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, false, BarChart, CONST.vis.barAbsMini, resNames, true,  false,                                                          false, true, null );
          }
        }

        break;
    }
  }
  
  // (2.3.2) One resource:
  else {
    // @@@@ 
    fnVisGenGridData = (state.args.uiGridActLstMode || topic === null ? visGenGridDataOneRes : (res.id === "AVG" ? visGenGridDataAllRes_act : visGenGridDataOneRes_act));
    
    var res   = data.resources[state.vis.resIdx];  // the currenly selected resource
    var act   = (topic && topic.activities ? topic.activities[res.id] || [] : []);
    
    var topicNames = (topic === null ? $map(function (x) { return x.name; }, data.topics) : [topic.name].concat($map(function (x) { return x.name; }, act)));
    
   
    
    switch (state.vis.mode) {
      // (2.3.2.1) Group comparison mode:
      case CONST.vis.mode.grp:
 
        // (a) My progress, deviation from group, and group:
        if ((doMe || doGrp) && state.args.uiGridMeVis) {
            
          // Topics and activites in a non-AVG resource-focus:
          if (topic === null || (topic !== null && res.id !== "AVG") || (state.args.uiGridActLstMode)) {
            var title = null
            if(state.args.uiGridOneHeadMeVis) {
              var group_name = getComparisonGroupName();
              var comparison_metric = get_comparison_metric()

              if(state.args.uiGridGrpVis) {
                if(state.args.controlSC) {
                  group_name =  group_name.replace("progress","half").replace("Average","").toLowerCase() 
                } else if(state.args.slidingControlSC) {
                  group_name = t('grid.my_peer_group');
                } else {
                  group_name =  group_name
                }

                title = t('grid.my_metric_vs_group', { groupName: group_name, comparison_metric: comparison_metric });
                
              } else {
                title = t('grid.my_metric', {comparison_metric: comparison_metric })
              }

              title += getTopicInfoString(topic)
            }

            //var seriesNames = ["Me", "Me vs group", "Group"]; //Commented by @Jordan for Sergey's study
            let comparisonGroupName = t(findKeyByValue(locales.en, getComparisonGroupName()))
            var seriesNames = [t('peer.me'), t('grid.me_vs_comp_group', {comparison_group: comparisonGroupName}), comparisonGroupName];

            var colorScales = [
              CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]),
              CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]),
              CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1])
            ];
            if(state.args.uiGridGrpVis){
                visGenGrid    (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "mevsgrp", me,          grp,       seriesNames, colorScales,                                                                                                                                                         true,  true ), CONST.vis.gridDev, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barDevMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true , "one-res" );
            }else{
                visGenGrid    (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "me",        me,          grp,       seriesNames, colorScales,                                                                                                                                                         true,  true ), CONST.vis.gridDev, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barDevMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true , "one-res" );
            }
          }
          
          // Activites in the AVG resource-focus:
          else {
            if (doMe && state.args.uiGridMeVis) {
                
              var title = getMeGridTitle(state.args.uiGridAllHeadMeVis, topic);
              visGenGrid  (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "me",        me,           null,     resNames,    $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me[data.vis.color.binCount - 1]);                                                    }, data.resources), true,  true ), CONST.vis.gridAbs, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barDevMini, resNames, true,  true,                                                           false, true, null );
            }
            
            if ((doMe || doGrp) && state.args.uiGridMeGrpVis) {
                
              var title = (state.args.uiGridAllHeadMeGrpVis ? t('grid.me_versus_group') : null);
              visGenGrid  (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "mevsgrp", me,           grp,      [],          $map(function (x) { return CONST.vis.colors.grpRev[data.vis.color.binCount - 1].concat(["#eeeeee"], CONST.vis.colors.me[data.vis.color.binCount - 1]); }, data.resources), false, true ), CONST.vis.gridDev, title, null,                         false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barDevMini, resNames, true,  true,                                                           false, true, null );
            }
            
            if (doGrp && state.args.uiGridGrpVis) {
              
              var title = (state.args.uiGridAllHeadGrpVis ? t('grid.group_with_title',{groupTitle:groupTitle}) : null);
              visGenGrid  (ui.vis.grid.cont.grp,    fnVisGenGridData(null,     "grp",       grp,          null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]);                                                   }, data.resources), false, true ), CONST.vis.gridAbs, title, null,                         false, false,                       0,                           state.vis.grid.cornerRadius, 0,         state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  true,                                                           false, true, null );
            }
          }
        }
        
        // (b) Others:
 
        if ((doGrp || doOthers) && state.args.uiGridOthersVis) {
          $($$input("button", ui.vis.grid.cont.others, "btn-others-load", null, (state.args.dataReqOtherLearners ? t('ranked_list.hide', {metric:get_comparison_metric()}) : t('ranked_list.show', {metric:get_comparison_metric()})))).button().click(loadDataOthers);
            if (state.args.dataReqOtherLearners) {
              // Topics and activites in a non-AVG resource-focus:
              if (topic === null || (topic !== null && res.id !== "AVG") || (state.args.uiGridActLstMode)) {
                var gridData = { topics: topicNames, sepX: [1], series: [] };
                for (var i=0, ni=others.length; i < ni; i++) {
                  var other = others[i];
                  var colorScales = (i === meIdx
                    ? colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me [data.vis.color.binCount - 1]); }, data.resources)
                    : colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp[data.vis.color.binCount - 1]); }, data.resources)
                  );
                  var seriesNames = (meIdx === i ? [(i+1) + ". " + t('peer.me') + "->"] : 
                                      [state.args.peerSelectionConsent && state.args.uiComparisonOption == "sc-option-peer" ? 
                                      (i+1) + ". " + data.context.class_list.filter(e=> e[1] == other.id).map(e=>e[0]).join("").substring(0,20)
                                      :""]);
                  //var seriesNames = [""];
                 fnVisGenGridData(gridData, "others",    other,        null,     seriesNames, colorScales, false, true );
               }
                var title = getOthersGridTitle(state.args.uiGridOneHeadOthersVis, othersTitle, meIdx, others.length);
                                                                                                                                                                              
                visGenGrid    (ui.vis.grid.cont.others, gridData,                                                                                                                                                                                                                                                                   CONST.vis.gridAbs, title, tbarOther,                    false, false,                        state.vis.otherIndCellH,     0,                           topicMaxW, state.vis.grid.xLblAngle,  0, false, null,     null,                 resNames, true,  false,                                                          false, true, null );
              }
              // Activites in the AVG resource-focus:
              else {
                for (var i=0, ni=others.length; i < ni; i++) {
                  var other = others[i];
                  var colorScales = (i === meIdx
                    ? colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.me  [data.vis.color.binCount - 1]); }, data.resources)
                    : colorScales = $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.grp [data.vis.color.binCount - 1]); }, data.resources)
                  );
                  var title = getOthersGridTitle(state.args.uiGridOneHeadOthersVis && i === 0, othersTitle, meIdx, others.length);;
                  visGenGrid  (ui.vis.grid.cont.others, fnVisGenGridData(null,     "others",    other,        null,     resNames,    colorScales,                                                                                                                                                         false, true ), CONST.vis.gridAbs, title, (i === 0 ? tbarOther : null), false, false,                       CONST.vis.otherIndCellH.def, 0,                           topicMaxW, state.vis.grid.xLblAngle,  0, false, null,     null,                resNames, true,   true,                                                           false, true, null );
                }
              }
            }
        }
        break;
      
      // (2.3.2.2) Individual comparison mode:
      case CONST.vis.mode.ind:
        // (a) My progress:
        if (doMe && state.args.uiGridMeVis) {
          // Topics and activites in a non-AVG resource-focus:
          if (topic === null || (topic !== null && res.id !== "AVG") || (state.args.uiGridActLstMode)) {
            var title = getMeGridTitle(state.args.uiGridOneHeadMeVis, topic)
            visGenGrid    (ui.vis.grid.cont.me,     fnVisGenGridData(null,     "me",        me,           null,     [],          [["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1])],                                                                               data.resoueces,  true,  true ), CONST.vis.gridAbs, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true, null );
          }
          
          // Activites in the AVG resource-focus:
          else {
            var title = getMeGridTitle(state.args.uiGridAllHeadMeVis, topic);
            visGenGrid   (ui.vis.grid.cont.me,      fnVisGenGridData(null,     "me",        me,           null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources), true,  true ), CONST.vis.gridAbs, title, tbarMe,                       false, true,                        0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, true,  BarChart, CONST.vis.barAbsMini, resNames, true,  (topic === null || state.args.uiGridActLstMode ? true : false), true,  true, null );
          }
        }
        
        // (b) Others:
        if (doOthers && state.args.uiGridOthersVis) {
          // Topics and activites in a non-AVG resource-focus:
          if (topic === null || (topic !== null && res.id !== "AVG") || (state.args.uiGridActLstMode)) {
            var gridData = { topics: topicNames, sepX: [1], series: [] };
            var idxMe = -1;
            for (var i=0, ni=others.length; i < ni; i++) {
              var other = others[i];
              if (other.id === me.id) idxMe = i;
              var seriesNames = (idxMe === i ? [(i+1) + ". Me"] : [""]);
                                                    fnVisGenGridData(gridData, "other",     other,        null,     seriesNames, $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources), true,  true );
            }
            var title = getOthersGridTitle(state.args.uiGridOneHeadOthersVis, othersTitle, idxMe, others.length);
            visGenGrid    (ui.vis.grid.cont.others, gridData,                                                                                                                                                                                                                                                        CONST.vis.gridAbs, title, tbarOther,                    false, true,                        state.vis.otherIndCellH,     0,                           topicMaxW, state.vis.grid.xLblAngle,  0, false, null,     null,                 resNames, true,  false,                                                          false, true, null );
          }
          
          // Activites in the AVG resource-focus:
          else {
            for (var i=0, ni=others.length; i < ni; i++) {
              var other = others[i];
              var title = getOthersGridTitle(state.args.uiGridAllHeadOthersVis && i === 0, othersTitle, meIdx, others.length);
              
              visGenGrid  (ui.vis.grid.cont.others,fnVisGenGridData(null,     "others",    other,        null,     [],          $map(function (x) { return ["#eeeeee"].concat(CONST.vis.colors.indiv[data.vis.color.binCount - 1]);                                                   }, data.resources),  false, true ), CONST.vis.gridAbs, title, (i === 0 ? tbarOther : null), false, false,                       0,                           state.vis.grid.cornerRadius, topicMaxW, state.vis.grid.xLblAngle, 30, false, BarChart, CONST.vis.barAbsMini, resNames, true,  false,                                                          false, true, null );
            }
          }
        }
        break;
    }
  }
  
  // (3) Sunburst:
  $removeChildren(ui.vis.sunburst);
  
  // (4) Other:
  window.scrollTo(scroll.x, scroll.y);
}

function getMeGridTitle(condition, topic) {
    return (condition
        ? t('peer.me') + getTopicInfoString(topic)
        : null);
}

function getTopicInfoString(topic) {
  return (topic === null || state.args.uiGridActLstMode
                ? ""
                : " &nbsp; <span class=\"info\">(" + t('title.topic') + ": " + topic.name + ")</span>")
}

function getOthersGridTitle(condition, othersTitle, meIdx, othersLength) {
  return (condition ? othersTitle + " &nbsp; <span class=\"info\">" + 
                                (meIdx === -1 ? t('grid.not_here') : 
                                                t('grid.you_are_ranked',{rank:meIdx + 1,
                                                                        total: othersLength  })) + "</span>" : null);  
}


// ------------------------------------------------------------------------------------------------------
/**
 * Generated data for the grid visualization based on all resources.  Separate grid data should be 
 * generated for the current learner, the group, and the deviation from the group.
 * 
 * If 'gridData' is null a new object is returned.  Otherwise, the one passed is modified.
 * 
 * If 'learner02' is defined then the difference between them and the first learner is returned.  This 
 * is utilized in the deviation from group calulations where the second learner is the group.
 */
function visGenGridDataAllRes(gridData, gridName, learner01, learner02, seriesNames, colorScales, doShowSeq, doIncAvg) {
  if (gridData === null || gridData === undefined) var gridData = { gridName: gridName, topics: $map(function (x) { return x.name; }, data.topics), sepX: (doIncAvg ? [1] : []), series: [] };
  
  for (var i=0, ni=data.resources.length; i < ni; i++) {
    var r = data.resources[i];
    var s;
    if(i==0){ // the first has id as it is used for display the help button
        s = { id: "h", resIdx: i, name: r.name, colorScale: colorScales[i], doShowSeq: doShowSeq, data: [] };  // new series
    }else{
        s = { resIdx: i, name: r.name, colorScale: colorScales[i], doShowSeq: doShowSeq, data: [] };  // new series
    }
    
    for (var j=(doIncAvg ? 0 : 1), nj=data.topics.length; j < nj; j++) {
      var t = data.topics[j];
      s.data.push({
        topicIdx : j,
        resIdx   : i,
        actIdx   : -1,
        //seq      : (t.sequencing !== undefined ? t.sequencing[r.id] || 0 : 0),
        seq      : (doShowSeq && learner01.state.topics[t.id].sequencing !== undefined ? learner01.state.topics[t.id].sequencing[r.id] || 0 : 0),
        val      : learner01.state.topics[t.id].values[r.id][getRepLvl().id] - (learner02 === null ? 0 : learner02.state.topics[t.id].values[r.id][getRepLvl().id]),
        valMe    : learner01.state.topics[t.id].values[r.id][getRepLvl().id],
        valGrp   : (learner02 === null ? -1 : learner02.state.topics[t.id].values[r.id][getRepLvl().id]),
        isInt    : (learner01.id === data.context.learnerId && r.id !== "AVG"),
        isVis    : true,
        isLocked : t.locked,
        dueDate : t.lockTime,
        isIncentiveExpired: state.args.uiIncenCheck?t.incentiveExpired:false
      });
    }
    gridData.series.push(s);
  }
  
  return gridData;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Generated data for the grid visualization based on only the currently selected resource.  The 
 * resulting grid data combines data for the current learner, the group, and the deviation from the 
 * group.  Therefore, separate grids are unnecessary.
 * 
 * If 'gridData' is null a new object is returned.  Otherwise, the one passed is modified.
 * 
 * If 'learner02' is defined then the difference between them and the first learner is returned.  This 
 * is utilized in the deviation from group calulations where the second learner is the group.
 * 
 * 'seriesNames' is an array which redefines the default series names if the appropriate elements are 
 * provided.  If no name redefinition is desired, the array should be empty instead of null.
 */
function visGenGridDataOneRes(gridData, gridName, learner01, learner02, seriesNames, colorScales, doShowSeq, doIncAvg) {
  if (gridData === null || gridData === undefined) var gridData = { gridName: gridName, topics: $map(function (x) { return x.name; }, data.topics), sepX: (doIncAvg ? [1] : []), series: [] };
  // @@@@

  var r = data.resources[state.vis.resIdx];  // the currenly selected resource
  var s = null;
  
  // Me:
  s = { id: "me-h", resIdx: state.vis.resIdx, name: (seriesNames[0] !== undefined ? seriesNames[0] : t('peer.me')), colorScale: colorScales[0], doShowSeq: doShowSeq, data: [] };
  
  for (var j=(doIncAvg ? 0 : 1), nj=data.topics.length; j < nj; j++) {
    var t = data.topics[j];
    // if the resource is the average (overall) with index 0, then fill sequencing as the aggregation of the sequencing of individual resources
    if (state.vis.resIdx == 0 && learner01.state.topics[t.id].sequencing !== undefined){
        var seq = 0;
        
        for (var iRes=1, nRes=data.resources.length; iRes < nRes; iRes++) {
            if (learner01.state.topics[t.id].sequencing[data.resources[iRes].id] > seq) seq=learner01.state.topics[t.id].sequencing[data.resources[iRes].id];
        }
        learner01.state.topics[t.id].sequencing[r.id] = seq;
    }

    s.data.push({
      topicIdx : j,
      resIdx   : state.vis.resIdx,
      actIdx   : -1,
      //seq      : (t.sequencing !== undefined ? t.sequencing[r.id] || 0 : 0),
      seq      : (doShowSeq && learner01.state.topics[t.id].sequencing !== undefined ? learner01.state.topics[t.id].sequencing[r.id] || 0 : 0),
      val      : learner01.state.topics[t.id].values[r.id][getRepLvl().id],
      valMe    : learner01.state.topics[t.id].values[r.id][getRepLvl().id],
      valGrp   : -1,
      isInt    : (r.id !== "AVG"),
      isVis    : true,
      isLocked : t.locked,
      dueDate : t.lockTime,
      isIncentiveExpired: state.args.uiIncenCheck?t.incentiveExpired:false
    });
  }
  
  gridData.series.push(s);
  
  // Me versus group:
  if (learner02 !== null && state.args.uiGridMeGrpVis) {
    s = { id: "mevsgrp-h", resIdx: state.vis.resIdx, name: (seriesNames[1] !== undefined ? seriesNames[1] : t('grid.me_vs_group')), colorScale: colorScales[1], doShowSeq: false, data: [] };
    
    for (var j=(doIncAvg ? 0 : 1), nj=data.topics.length; j < nj; j++) {
      var t = data.topics[j];
      s.data.push({
        topicIdx : j,
        resIdx   : state.vis.resIdx,
        actIdx   : -1,
        seq      : 0,
        val      : learner01.state.topics[t.id].values[r.id][getRepLvl().id] - (learner02 === null ? 0 : learner02.state.topics[t.id].values[r.id][getRepLvl().id]),
        valMe    : learner01.state.topics[t.id].values[r.id][getRepLvl().id],
        valGrp   : (learner02 === null ? -1 : learner02.state.topics[t.id].values[r.id][getRepLvl().id]),
        isInt    : false,
        isVis    : true,
        isLocked : t.locked,
        dueDate : t.lockTime,
        isIncentiveExpired: state.args.uiIncenCheck?t.incentiveExpired:false
      });
    }
    
    gridData.series.push(s);
  }
  
  // Group:
  if (learner02 !== null && state.args.uiGridGrpVis) {
    s = { id: "grp-h", resIdx: state.vis.resIdx, name: (seriesNames[2] !== undefined ? seriesNames[2] : t('grid.group')), colorScale: colorScales[2], doShowSeq: false, data: [] };
    
    for (var j=(doIncAvg ? 0 : 1), nj=data.topics.length; j < nj; j++) {
      var t = data.topics[j];
      s.data.push({
        topicIdx : j,
        resIdx   : state.vis.resIdx,
        actIdx   : -1,
        seq      : 0,
        val      : -learner02.state.topics[t.id].values[r.id][getRepLvl().id],
        valMe    : -1,
        valGrp   : learner02.state.topics[t.id].values[r.id][getRepLvl().id],
        isInt    : false,
        isVis    : true
      });
    }
    
    gridData.series.push(s);
  }
  
  return gridData;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Return grid data for activities when in all resources mode (see desription for topics above for more 
 * info).
 */
function visGenGridDataAllRes_act(gridData, gridName, learner01, learner02, seriesNames, colorScales, doShowSeq, doIncAvg) {
  var topic = getTopic();
  // (1) Determing max number of columns:
  var colCntMax = -1;
  for (var i=0, ni=data.resources.length; i < ni; i++) {
    var res = data.resources[i];
    var act = topic.activities[res.id];
    colCntMax = Math.max(colCntMax, (act ? act.length : 0));
  }
  
  // (2) Create the gridData object if necessary:
  if (gridData === null || gridData === undefined) {
    var gridData = { gridName: gridName, topics: /*[topic.name]*/(doIncAvg ? (state.args.uiGridActLstMode ? [t('grid.overall')] : [t('grid.back_to_topics')]) : []), sepX: (doIncAvg ? [1] : []), series: [] };
    for (var i = 0; i < colCntMax; i++) gridData.topics.push("");
  }
  
  // (3) Generate data:
  for (var i=(state.args.uiGridActLstMode ? 1 : 0), ni=data.resources.length; i < ni; i++) {
    var res = data.resources[i];
    var act = topic.activities[res.id];
    
    // (3.1) Prepare series:
    var s = { resIdx: i, name: res.name, colorScale: colorScales[i], doShowSeq: doShowSeq, data: [] };  // new series
    
    // (3.2) Add the topic (which serves as the average over all activities):
    if (doIncAvg) {
      s.data.push({
        topicIdx : state.vis.topicIdx,
        resIdx   : i,
        actIdx   : -1,
        seq      : 0,
        val      : learner01.state.topics[topic.id].values[res.id][getRepLvl().id] - (learner02 === null || !learner01.state.topics ? 0 : learner02.state.topics[topic.id].values[res.id][getRepLvl().id]),
        valMe    : learner01.state.topics[topic.id].values[res.id][getRepLvl().id],
        valeGrp  : (learner02 === null || !learner01.state.topics ? -1 : learner02.state.topics[topic.id].values[res.id][getRepLvl().id]),
        isInt    : true,
        isVis    : true,
        isLocked : false,
        dueDate : null
      });
    }
    
    // (3.3) Add activities:
    var colCnt = 0;
    if (act && learner01.state.activities) {
      for (var j=0, nj=act.length; j < nj; j++) {
        var a = act[j];
        
        s.data.push({
          topicIdx : state.vis.topicIdx,
          resIdx   : i,
          actIdx   : j,
          actName  : a.name,
          //seq      : (a.sequencing || 0),
          //seq      : (doShowSeq && learner01.state.activities[topic.id][res.id][a.id].sequencing !== undefined ? learner01.state.activities[topic.id][res.id][a.id].sequencing || 0 : 0),
          seq      : (doShowSeq && learner01.state.activities[topic.id][data.resources[i].id][a.id].sequencing !== undefined ? learner01.state.activities[topic.id][data.resources[i].id][a.id].sequencing || 0 : 0),
          val      : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id] - (learner02 === null || !learner01.state.activities ? 0 : learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id]),
          valMe    : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
          valGrp   : (learner02 === null || !learner01.state.activities ? -1 : learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id]),
          isInt    : true,
          isVis    : true,
          isLocked : false,
          dueDate : null,
          isIncentiveExpired: false
        });
        colCnt++;
      }
    }
    
    // Add empty data points to make all series equal length:
    for (var j = colCnt; j < colCntMax; j++) {
      s.data.push({ resIdx: i, topicIdx: state.vis.topicIdx, actIdx: -1, seq: 0, val: 0, isInt: false, isVis: false, isLocked:false});
    }
    
    gridData.series.push(s);
  }
  
  return gridData;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Return grid data for activities when in one resource mode (see desription for topics above for more 
 * info).
 */
function visGenGridDataOneRes_act(gridData, gridName, learner01, learner02, seriesNames, colorScales, doShowSeq, doIncAvg) {
  var topic = getTopic();
  var res   = data.resources[state.vis.resIdx];  // the currenly selected resource
  var act   = (topic.activities ? topic.activities[res.id] || [] : []);
  
  // (1) Determing max number of columns:
  var colCntMax = (act ? act.length : 0);
  
  // (2) Create the gridData object if necessary:
  if (gridData === null || gridData === undefined) {
    var gridData = { gridName: gridName, topics: /*[topic.name]*/(doIncAvg ? (state.args.uiGridActLstMode ? [t('grid.overall')] : [t('grid.back_to_topics')]) : []).concat($map(function (x) { return x.name; }, act)), sepX: (doIncAvg ? [1] : []), series: [] };
    for (var i = 0; i < colCntMax; i++) gridData.topics.push("");
  }
  
  var s      = null;  // a series
  var colCnt = 0;
  
  // (3) Generate data:
  // (3.1) Me:
  s = { resIdx: state.vis.resIdx, name: seriesNames[0], colorScale: colorScales[0], doShowSeq: doShowSeq, data: [] };
  
  // (3.1.1) Add the topic (which serves as the average over all activities):
  if (doIncAvg) {
    s.data.push({
      topicIdx : state.vis.topicIdx,
      resIdx   : state.vis.resIdx,
      actIdx   : -1,
      seq      : 0,
      val      : learner01.state.topics[topic.id].values[res.id][getRepLvl().id],
      valMe    : learner01.state.topics[topic.id].values[res.id][getRepLvl().id],
      valGrp   : -1,
      isInt    : true,
      isVis    : true,
      isLocked : false,
      dueDate : null,
      isIncentiveExpired: false
    });
  }
  
  // (3.1.2) Add the activities:
  colCnt = 0;
  if (act && learner01.state.activities) {
    for (var j=0, nj=act.length; j < nj; j++) {
      var a = act[j];
      s.data.push({
        topicIdx : state.vis.topicIdx,
        resIdx   : state.vis.resIdx,
        actIdx   : j,
        actName  : a.name,
        //seq      : (a.sequencing || 0),
        seq      : (doShowSeq && learner01.state.activities[topic.id][res.id][a.id].sequencing !== undefined ? learner01.state.activities[topic.id][res.id][a.id].sequencing || 0 : 0),
        val      : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
        valMe    : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
        valeGrp  : -1,
        isInt    : true,
        isVis    : true,
        isLocked : false,
        dueDate : null
      });
      colCnt++;
    }
  }
  
  gridData.series.push(s);
  
  // (3.2) Me versus group:
  if (learner02 !== null) {
    s = { resIdx: state.vis.resIdx, name: seriesNames[1], colorScale: colorScales[1], doShowSeq: false, data: [] };
    
    // (3.2.1) Add the topic (which serves as the average over all activities):
    if (doIncAvg) {
      s.data.push({
        topicIdx : state.vis.topicIdx,
        resIdx   : state.vis.resIdx,
        actIdx   : -1,
        seq      : 0,
        val      : learner01.state.topics[topic.id].values[res.id][getRepLvl().id],
        valMe    : learner01.state.topics[topic.id].values[res.id][getRepLvl().id],
        valGrp   : -1,
        isInt    : true,
        isVis    : true,
        isLocked : false,
        dueDate : null,
        isIncentiveExpired: false
      });
    }
    
    // (3.2.2) Add the activities:
    colCnt = 0;
    if (act && learner01.state.activities) {
      for (var j=0, nj=act.length; j < nj; j++) {
        var a = act[j];
        s.data.push({
          topicIdx : state.vis.topicIdx,
          resIdx   : state.vis.resIdx,
          actIdx   : j,
          actName  : a.name,
          seq      : 0,
          val      : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id] - (learner02 === null || !learner01.state.activities ? 0 : learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id]),
          valMe    : learner01.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
          valGrp   : (learner02 === null || !learner01.state.activities ? 0 : learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id]),
          isInt    : false,
          isVis    : true,
          isLocked : false,
          dueDate : null,
          isIncentiveExpired: false
        });
        colCnt++;
      }
    }
    
    gridData.series.push(s);
  }
  
  // (3.3) Group:
  if (learner02 !== null) {
    s = { resIdx: state.vis.resIdx, name: seriesNames[2], colorScale: colorScales[2], doShowSeq: false, data: [] };
    
    // (3.2.1) Add the topic (which serves as the average over all activities):
    if (doIncAvg) {
      s.data.push({
        topicIdx : state.vis.topicIdx,
        resIdx   : state.vis.resIdx,
        actIdx   : -1,
        seq      : 0,
        val      : -learner02.state.topics[topic.id].values[res.id][getRepLvl().id],
        valMe    : -1,
        valGrp   : learner02.state.topics[topic.id].values[res.id][getRepLvl().id],
        isInt    : true,
        isVis    : true,
        isLocked : false,
        dueDate : null
      });
    }
    
    // (3.3.2) Add the activities:
    colCnt = 0;
    if (act && learner01.state.activities) {
      for (var j=0, nj=act.length; j < nj; j++) {
        var a = act[j];
        s.data.push({
          topicIdx : state.vis.topicIdx,
          resIdx   : state.vis.resIdx,
          actIdx   : j,
          actName  : a.name,
          seq      : 0,
          val      : -learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
          valMe    : -1,
          valGrp   : learner02.state.activities[topic.id][res.id][a.id].values[getRepLvl().id],
          isInt    : false,
          isVis    : true,
          isLocked : false,
          dueDate : null,
          isIncentiveExpired: false
        });
        colCnt++;
      }
    }
    
    gridData.series.push(s);
  }
  
  return gridData;
}


// ------------------------------------------------------------------------------------------------------
function visGenSunburstData(topic, learner01, learner02, colorScale) {
  return { topic: topic, colorScale: colorScale };
}


// ------------------------------------------------------------------------------------------------------
/**
 * Should the cell width be varied (according to the selected topic or activity variable)?
 */
function visDoVaryCellW() {
  return (state.vis.topicSize.attr.length > 0 && getTopic() === null);
}


// ------------------------------------------------------------------------------------------------------
/**
 * Generates a grid.
 */
function visGenGrid(cont, gridData, settings, title, tbar, doShowYAxis, doShowXLabels, sqHFixed, cornerRadius, topicMaxW, xLblAngle, extraPaddingB, isInteractive, miniVis, miniSettings, resNames, doShowResNames, doShowTimeline, doReserveTimelineSpace, doUpdActLstTopicCellX, helpId) {
  var tbl = $$tbl(cont, null, "grid", 0, 0);
  if (doUpdActLstTopicCellX) ui.vis.actLst.topicCellX = [];
  
  // (1) Header:
  // Title:
  if (title !== null && title.length > 0) {
    $setAttr($$("td", $$("tr", tbl), null, "title", title), { colspan: 2 });
  }
  
  // Toolbar:
  if (tbar !== null) {
    var td = $setAttr($$("td", $$("tr", tbl), null, "tbar"), { colspan: 2 });
    td.appendChild(tbar);
  }
  
  // (2) Generate visualization:
  // (2.1) Calculate some important values:
  doShowTimeline = doShowTimeline && state.args.uiGridTimelineVis;
  
  var topicOffsetT = svgGetMaxTextBB([title]).height + 4 + (state.args.uiIncenCheck?20:0);
  var seriesOffsetL = svgGetMaxTextBB($.map(gridData.series, function (x) { return x.name; })).width + 10;
  var resOffsetL = svgGetMaxTextBB(resNames).width + 10;
  var resOffsetL = Math.max(resOffsetL, seriesOffsetL);
  var topicMaxWCos = Math.ceil(topicMaxW * Math.cos((xLblAngle === 45 ? 45 : 0) * (Math.PI / 180)));
  var paddingL = (doShowYAxis ? settings.padding.l : 10);
  var paddingT = (doShowXLabels ? topicMaxWCos : 0);
  var helpColorOffset = 150;
  //var sqW = Math.floor((settings.w - paddingL - settings.padding.r - settings.sq.padding) / gridData.series[0].data.length);
  var sqW = settings.sq.w;
  var sqH = (sqHFixed === 0 ? sqW : sqHFixed);
  var visW = ((sqW + settings.sq.padding) * (gridData.series.length>0?gridData.series[0].data.length:1)) + paddingL + settings.padding.r + resOffsetL +  (state.args.uiShowHelp && helpId ? helpColorOffset : 0);
  var visH = ((sqH + settings.sq.padding) * gridData.series.length) + settings.padding.t + settings.padding.b + topicOffsetT + paddingT + (doReserveTimelineSpace && state.args.uiGridTimelineVis ? 30 : 0);
  var sepXAggr = 0;
  
  if (visDoVaryCellW()) {
    var topicSizeSum = $lfold(function (a,b) { return a+b; }, $map(function (x) { return visGetTopicSize(x); }, data.topics), 0);
    sqW = Math.floor(sqW / (topicSizeSum / gridData.series[0].data.length));  // in the case of equal topic sizes, the denominator is 1 and therefore wouldn't change the value of sqW, but for unequal topic sizes it scales the default sqW
  }
  
  CONST.vis.otherIndCellH.max = sqW;
  
  var tr = $$("tr", tbl);
  
  // (2.3) Prepare scales:
  var scaleX =
    d3.scale.ordinal().
    domain(gridData.topics).
    rangePoints([ paddingL + sqW / 2 + resOffsetL, visW - settings.padding.r - sqW / 2 ]);
  
  var scaleY = $map(
    function (x) {
      var scale =
        d3.scale.linear().
        domain(settings.scales.y).
        range(x.colorScale);
      return scale;
    },
    gridData.series
  );
  
  // (2.4) Prepare axes:
  // (nothing to do here at this point because no axes are shown)
  
  // (2.5) SVG:
  var svg =
    d3.select($$("td", tr)).
    append("svg").
    attr("style", "padding-bottom: " + (gridData.series.length > 1 ? extraPaddingB : 0) + "px;").
    attr("width", visW + (gridData.sepX.length * settings.sepX) + (xLblAngle === 45 ? topicMaxWCos : 0)).
    attr("height", visH);
  
  // (2.6) Mini bar chart series:
  var mini = { svg: null, settings: miniSettings, series: {} };
  if (state.args.uiShowBarChart && miniVis) {
    mini.svg = miniVis($$("td", tr), gridData, mini.settings, null, 2, false).
      //addSeries("pri", { sepX: gridData.sepX, series: $.map(data.series, function (x) { return 0; }) }, 0, "l-gray", null, null).
      addSeries("pri", gridData, 0, 0, "l-gray", function (x) { return x.val; }, null).
      setVis(false).
      style("margin-top", (topicOffsetT + paddingT - mini.settings.padding.t) + "px");
  }
  else {
    $$("td", tr);  // preserve the two-column table layout for consistency
  }
  
  // (2.7) X axis:
  if (doShowXLabels) {
    var txtX = (!visDoVaryCellW() ? (sqW / 2 - 2) : 6);  // the x-coordinate of the text label being drawn
    svg.
      append("g").
      attr("class", "x-axis").
      selectAll("text").
      data(gridData.topics).
      enter().
        append("text").
        attr("x", 1).
        attr("y", 1).
        style("text-anchor", "start").
        text(function (d) { return d; }).
        attr("transform", function (d,i) {
          if ($.inArray(i, gridData.sepX) !== -1) { txtX += settings.sepX; }
          txtX += (i === 0 ? 0 : sqW * visGetTopicSize(data.topics[i-1]) + settings.sq.padding);
          return "translate(" + (resOffsetL + paddingL + txtX + 1) + "," + (topicOffsetT + paddingT) + ") rotate(-45)";
        }).
        style("text-rendering", "geometricPrecision");
  }
  
  // (2.8) The grid:
  var gGrid = svg.
    append("g").
    attr("class", "grid");
	
	if(state.args.uiIncenCheck){ 
    var me_data = getMe()["state"]["activities"];
    var credit_achievement = incentives.generate_incentive_status(me_data)
	}
  
  for (var iSeries = 0; iSeries < gridData.series.length; iSeries++) {
    var s = gridData.series[iSeries];
    var res = data.resources[s.resIdx];
    
    // Resource name:
    if (doShowResNames) {
      svg.
        append("text").
        attr("x", 1).
        attr("y", ((sqH + settings.sq.padding) * iSeries) + (sqH / 2) + 5 + topicOffsetT + paddingT).
        text(s.name).
        attr("class", "res").
        style("text-rendering", "geometricPrecision");

    }
    
    // Help:
    //
    if(state.args.uiShowHelp){
      if(helpId && s.id) {
        var helpOrigin = helpId + "-" + s.id; //States which kind of help is shown.
		
        var colorHelp = svg.
          append("g").
          attr("class", "helpButton").
          attr("helpId",helpId).
          attr("serieId",(s.id ? s.id : "")).
          attr("cursor","pointer").
          on("click",function() {
            var origin = d3.select(this).attr("helpId") + '-' + d3.select(this).attr("serieId");
            helpDialogShow(origin,d3.mouse(this)[0],d3.mouse(this)[1]+57);
            //helpDialogShow(origin,event.clientX,event.clientY);
          }).
          on("mouseover",function () {d3.select(this).style("opacity","1");}).
          on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
          style("opacity", "0.7");
        
        var image = colorHelp.
              append("image").
              attr("x", (resOffsetL + paddingL + settings.sepX + (sqW+settings.sq.padding) * data.topics.length)).
              attr("y", ((sqH + settings.sq.padding) * iSeries)  + 5 + topicOffsetT + paddingT).
              attr("width", 22).
              attr("height", 19).
              attr("xlink:href","img/help.png")
          
        if(state.args.uiShowColorScale) { //Show color scale  
          var color_one_res_ind = ["rgb(238, 238, 238)","#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"];
          var color_one_res_vs = ["#08519c","#3182bd","#6baed6","#9ecae1","#c6dbef","rgb(238, 238, 238)","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"];
          var color_one_res_grp = ["rgb(238, 238, 238)","#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"];
          var color_all_res_ind = ["rgb(238, 238, 238)","#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"];
          var color_all_res_vs = ["#08519c","#3182bd","#6baed6","#9ecae1","#c6dbef","rgb(238, 238, 238)","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"];
          var color_all_res_grp = ["rgb(238, 238, 238)","#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"];
          
          var helpColorData;

          if( helpOrigin === "one-res-me-h") {
            helpColorData = color_one_res_ind;
          } else if(helpOrigin === "one-res-mevsgrp-h") {
            helpColorData = color_one_res_vs;
          } else if(helpOrigin === "one-res-grp-h"){
            helpColorData = color_one_res_grp;
          } else if(helpOrigin === "all-res-me-h") {
            helpColorData = color_all_res_ind;
          } else if(helpOrigin === "all-res-mevsgrp-h") {
            helpColorData = color_all_res_vs;
          } else if(helpOrigin === "all-res-grp-h") {
            helpColorData = color_all_res_grp;
          }
          
          colorHelp.append("text").
            attr("x", (resOffsetL + paddingL + settings.sepX + (sqW+settings.sq.padding) * data.topics.length + 22)).
            attr("y", ((sqH + settings.sq.padding) * iSeries)  + 18 + topicOffsetT + paddingT)
            .text(function() {
              if(s.id == "mevsgrp-h") {
                return t('group_plus');
              } else {
                return "0%";
              }
            })
          
          colorHelp.selectAll("rect")
            .data(helpColorData)
            .enter().append("rect")
              .attr("x", function(d,i){
                return (resOffsetL + paddingL + settings.sepX + (sqW+settings.sq.padding) * data.topics.length + 55 + i*10)
                })
              .attr("y", ((sqH + settings.sq.padding) * iSeries)  + 5 + topicOffsetT + paddingT)
              .attr("width", 10)
              .attr("height", 18)
              .attr("fill", function(d,i){return d}
              )
          
            colorHelp.append("text").
              attr("x", (resOffsetL + paddingL + settings.sepX + (sqW+settings.sq.padding) * data.topics.length + 57 + (10*helpColorData.length))).
              attr("y", ((sqH + settings.sq.padding) * iSeries)  + 18 + topicOffsetT + paddingT)
              .text(function() {
                if(s.id == "mevsgrp-h") {
                  return t('legend.you_plus');
                } else {
                  return "100%";
                }
              });
              
            colorHelp.append("title")
              .text(function (d) {
                return s.name; 
              })
        }		
      } else if(s.name && state.args.uiShowContentHelp){
        var data_resource = data.resources.find(e=>e.name === s.name)

        if(data_resource) {
          svg.
            append("g").
            attr("class", "helpButton").
            attr("helpId",s.name).
            attr("id",s.name).
                attr("cursor","pointer").
                on("click",function() {
                  var origin = d3.select(this).attr("helpId");
                  var help_coordinate = d3.select(this).node().getBoundingClientRect();
                  helpDialogShow(origin,help_coordinate.x + 50,help_coordinate.y - 100);
                }).
                on("mouseover",function () {d3.select(this).style("opacity","1");}).
                on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
                style("opacity", "0.7").
                  append("image").
                  attr("x", function(d){
                    return resOffsetL + settings.sepX + (sqW+settings.sq.padding) * getTopic().activities[data_resource.id].length 
                  }).
                  attr("y", ((sqH + settings.sq.padding) * iSeries)  + 5 + topicOffsetT + paddingT).
                  attr("width", 20).
                  attr("height", 18).
                  attr("xlink:href","img/help.png");
              }
              
              svg.style("width", (parseFloat(svg.style("width").replace("px","")) + settings.sepX/2) + 'px')
      }

    
		
    }
    
    // Mini-series (e.g., bar chart):
    if (state.args.uiShowBarChart && miniVis) {
      mini.series[res.id] = [];
      for (var j=0, nj=gridData.series[0].data.length; j < nj; j++) {
        mini.series[res.id].push(s.data[j].val);
      }
    }
    
    // Grid cells -- The group:
    var sqX = 0;  // the x-coordinate of the cell being drawn
    
    var g = gGrid.
      selectAll("grid-" + res.id).
      data(s.data).
        enter().
        append("g").
        attr("class", "grid-cell-outter").
        attr("transform", function (d,i) {
          if ($.inArray(i, gridData.sepX) !== -1) { sqX += settings.sepX; }
          sqX += (i === 0 ? 0 : sqW * visGetTopicSize(data.topics[i-1]) + settings.sq.padding);
          var x = resOffsetL + paddingL + sqX;
          var y = ((sqH + settings.sq.padding) * iSeries) + settings.padding.t + topicOffsetT + paddingT;
          
          if (doUpdActLstTopicCellX && iSeries === 0 && i > 0) ui.vis.actLst.topicCellX.push(x + (sqW / 2));  // save the x-coordinate of cell to align activities list
          
          return "translate(" + x + "," + y + ")";
        }).
        
        attr("data-grid-name",  gridData.gridName).
        attr("data-idx",        function (d,i) { return i; }).
        attr("data-series-idx", iSeries).
        attr("data-var-id",     res.id).
        attr("data-var-name",   res.name).
        attr("data-topic-idx",  function (d) { return d.topicIdx; }).
        attr("data-val",        function (d) { return d.val; }).
        attr("data-val-me",     function (d) { return d.valMe  != null ? d.valMe  : -1; }).
        attr("data-val-grp",    function (d) { return d.valGrp != null ? d.valGrp : -1; }).
        attr("data-res-idx",    function (d) { return d.resIdx; }).
        attr("data-act-idx",    function (d) { return d.actIdx; }).
        attr("data-cell-idx",   function (d) { return state.vis.grid.cellIdxMax++; }).
        
        append("g").
        attr("class", "grid-cell-inner");
		
		if(state.args.uiIncenCheck && cont.id != "act-lst" && cont.id != "grid-others" && s.id == "me-h"){
      svg.
        append("text").
        attr("x", 1).
        attr("y", topicOffsetT - 20).
        text(incentives.generate_status_text()).
        attr("class", "title").
        attr("id", "in-status-text").
        style("text-rendering", "geometricPrecision");

      if(state.curr.grp.startsWith("AaltoPythonFall2020")) {
        svg.
          append("g").
          attr("class", "helpButton").
          //attr("style","background-image: url('img/help.gif');").
          attr("helpId", "extra_points").
          attr("id", "extra_points_help").
              attr("serieId",(s.id ? s.id : "")).
              attr("cursor","pointer").
              on("click",function() {
                  helpDialogShow("extra_points",d3.mouse(this)[0],d3.mouse(this)[1]+57);
              }).
              on("mouseover",function () {d3.select(this).style("opacity","1");}).
              on("mouseout",function () {d3.select(this).style("opacity","0.7");}).
              style("opacity", "0.7").
                append("image").
                attr("x", 195).
                attr("y", 0).
                attr("width", 22).
                attr("height", 19).
                attr("xlink:href","img/help.png");
      }
      
			$('td.title').hide()
		}

    // g.append("path").
    // attr("class", "box").
    // attr("d", 
    //  function(d,i) {
    //   return rightRoundedRect(0, 0, 
    //     (d.isVis ? sqW * visGetTopicSize(data.topics[i]) : 0), 
    //     (d.isVis ? sqH: 0), 
    //     (!visDoVaryCellW() ? cornerRadius : 0))}).
    // // attr("d", function(d) {
    // //   return rightRoundedRect(0, 0, 
    // //     function (d,i) { return (d.isVis ? sqW * visGetTopicSize(data.topics[i]) : 0);}, 
    // //     function (d) { return (d.isVis ? sqH*.5: 0); },
    // //     (!visDoVaryCellW() ? cornerRadius : 0));
    // // }).
    // attr("style", function (d) { var d2 = (d.val >=0 ? data.vis.color.value2color(d.val) : -data.vis.color.value2color(-d.val)); return "fill: " + scaleY[iSeries](d2) + ";"; }).
    // style("shape-rendering", "geometricPrecision");

    // Use two half-width rectangles to represent both knowledge and progress but only in act-lst view. 
    var show_double_rectangle = !is_report_level_progress() && cont.id == "act-lst"

    var alternative_color_scale =
        d3.scale.linear().
        domain(settings.scales.y).
        range(["#eeeeee"].concat(CONST.vis.colors.me_alternative[data.vis.color.binCount - 1]));
    
    g.
      append("rect").
      attr("class", "box").
      attr("x", 0).
      attr("y", 0).
      attr("width", function (d,i) { return (d.isVis ? (sqW * visGetTopicSize(data.topics[i])) * (show_double_rectangle &&  d.resIdx > 2?.5:1) : 0); }).
      attr("height", function (d) { return (d.isVis ? sqH: 0); }).
      attr("rx", (!visDoVaryCellW() ? cornerRadius : 0)).
      attr("ry", (!visDoVaryCellW() ? cornerRadius : 0)).
      attr("style", function (d) { 
        if(d.isVis) {
          if(!show_double_rectangle) {
            var d2 = (d.val >=0 ? data.vis.color.value2color(d.val) : -data.vis.color.value2color(-d.val)); return "fill: " + scaleY[iSeries](d2) + ";"; 
          } else {
            var act_state = Object.values(Object.values(getMe().state.activities[getTopic().id])[d.resIdx-1])[d.actIdx].values
            d.act_state = act_state
            var d2 = (d.val >=0 ? data.vis.color.value2color(act_state.p) : -data.vis.color.value2color(-act_state.p)); 
            return "fill: " + alternative_color_scale(d2) + ";";  
          }
        }
      }).
      style("shape-rendering", "geometricPrecision");

    if(show_double_rectangle) {
      g.
      append("rect").
      attr("class", "box").
      attr("x", function (d,i) { return (d.isVis ? (.5*sqW * visGetTopicSize(data.topics[i])) : 0); }).
      attr("y", 0).
      attr("width", function (d,i) { return (d.isVis ? (.5*sqW * visGetTopicSize(data.topics[i])) : 0); }).
      attr("height", function (d) { return (d.isVis ? sqH: 0); }).
      attr("rx", (!visDoVaryCellW() ? cornerRadius : 0)).
      attr("ry", (!visDoVaryCellW() ? cornerRadius : 0)).
      attr("style", function (d) { 
        var d2 = (d.val >=0 ? data.vis.color.value2color(d.val) : -data.vis.color.value2color(-d.val)); 
        return "fill: " + scaleY[iSeries](d2) + ";"; 
      }).
      //style("display", function(d){d.resIdx <= 2?"none":"block"}).
      attr("visibility", function(d){return d.resIdx <= 2?"hidden":"visible"}).
      style("shape-rendering", "geometricPrecision");
    }
   
    g.append("title").
    text(function (d) {
        var tooltip = "";
        if(!d.isVis) return tooltip

        if (d.actName != null) tooltip += d.actName + '\n';
        if (d.valMe != -1) {
          if(!show_double_rectangle) {
            tooltip  += getRepLvl().name +' : '+ parseFloat(Math.round(Math.min(d.valMe,1) * 100)).toFixed(0)+'%';
            if(!is_report_level_progress()) { // Include progress as well
              var topic_progress = 0;
              if(d.topicIdx != 0) {
                 topic_progress = getMe().state.topics[data.topics[d.topicIdx].id].overall.p
              } else {
                topic_progress = getMe().state.topics['AVG'].values.AVG.p
              }
             tooltip  += '\n' + t('help.progress') + ': '+ parseFloat(Math.round(Math.min(topic_progress,1) * 100)).toFixed(0)+'%' + 
                        (state.curr.grp.includes("CMPUT175Fall2022") && (d.dueDate && d.dueDate >= new Date())? t('tooltip.due_for_credit'):'');
            } else if(state.curr.grp.includes("CMPUT175Fall2022") && cont.id != "act-lst" && (d.dueDate && d.dueDate >= new Date())) {
              tooltip  += t('tooltip.due_for_credit')
            }

          } else {
            if(d.resIdx > 2) {
              tooltip += t('help.progress') + ' : ' + parseFloat(Math.round(Math.min(d.act_state.p,1) * 100)).toFixed(0)+'%';
              tooltip +=  "\n" + t('help.performance') + ' : ' + parseFloat(Math.round(Math.min(d.valMe,1) * 100)).toFixed(0)+'%';
            } else {
              tooltip +=  t('help.progress') + ' : ' + parseFloat(Math.round(Math.min(d.act_state.p,1) * 100)).toFixed(0)+'%';
            }
          }

          if(d.isLocked && state.args.uiLockTopicAfterDueDate == false) {
            tooltip += "\n" + t('tooldip.topic_locked_future');
          } else if(d.dueDate) {
            tooltip += (d.dueDate < new Date())?"\n" + t('tooldip.due_date_passed'):"\n" + t('tooltip.due_date', {dueDate:d.dueDate.toLocaleString()})
          }

          if( !isNaN(d.valGrp) && d.valGrp != -1 )  tooltip += '\n';
        }
        if ( !isNaN(d.valGrp) && d.valGrp != -1 ) tooltip += t('tooltip.group_value', {repLevelName:getRepLvl().name, groupPercent: parseFloat(Math.round(Math.min(d.valGrp,1) * 100)).toFixed(0)}) 
        
        return tooltip; 
    });

	if(state.args.uiIncenCheck || state.args.uiGradualTopicOpening){
		if(s.id == "me-h" && isInteractive) { //Shows only at the me row
			g.append("svg:image")
			.attr("class","credit-img")
			.filter(function(d) { return d.actIdx==-1 && d.resIdx==0 && d.topicIdx>0 })
			  .attr('x', sqW / 2 + 6)
			  .attr('y', - sqW / 2 + 8)
			  .attr('width', 12)
			  .attr('height', 12)
			  .attr("xlink:href", function(d){
          if(!d.isLocked) {
            if(state.args.uiIncenCheck) {
              let topic_credit = credit_achievement[d.topicIdx-1]
                if(topic_credit==1){
                  return "./img/credit.png";
                }else{
                  if(topic_credit==.5){
                  return "./img/half_credit.png";
                  }else if(topic_credit==0){
                  return "./img/no_credit.png";
                  }else {
                    return;
                  }
                }
              } 
          } else {
            return "./img/lock2.png"
          }
      });
		}
  }
      
    
    // Grid cells -- Sequencing:
    if (s.doShowSeq) {
        if(CONST.vis.seqStars){
            g
            .append("svg:polygon")
            .attr("id", "star_1")
            .attr("visibility", "visible")
            //.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
            .attr("points", function (d) {  return (d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
            .attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
            //.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
            .attr("stroke", "white")
            .style("shape-rendering", "geometricPrecision");
        }else{
            g.
            append("circle").
            attr("class", "seq").
            attr("cx", 6).
            attr("cy", 6).
            //attr("r", function (d) { return (d.seq === 0 ? 0 : Math.max(d.seq * 4, 1)); }).
            attr("r", function (d) { return (d.seq === 0 ? 0 : 4); }).
            attr("stroke", "white").

            // append("path").
            // attr("class", "seq").
            // attr("d", function (d,i) { return (i > 0 && Math.random() <= 0.10 ? "M0,8 v-6 l2,-2 h6 z" : "M0,0"); }).
            attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; }).
            //attr("style", function (d) { return "fill: #000000;" }).
            style("shape-rendering", "geometricPrecision"); 
        }
 
    }
    
 }
  
  // (2.9) Timeline:
  if (doShowTimeline) {
    var gTimeline = svg.
      append("g").
      attr("class", "timeline").
      attr("transform", "translate(" + (resOffsetL + paddingL) + "," + (visH - 20) + ")");
    
    // (2.9.1) Line:
    gTimeline.
      append("line").
      attr("x1", (!visDoVaryCellW() ? (sqW / 2 - 2) : 6) + (sqW + settings.sq.padding) + (sqW / 2)).
      attr("y1", 0).
      attr("x2", (!visDoVaryCellW() ? (sqW / 2 - 2) : 6) + (sqW + settings.sq.padding) * (gridData.series[0].data.length - 1) + (gridData.sepX.length * settings.sepX)).
      attr("y2", 0).
      style("shape-rendering", "geometricPrecision");
    
    // (2.9.2) Points:
    var circleX = (!visDoVaryCellW() ? (sqW / 2 - 2) : 6);  // the x-coordinate of the timeline circle
    
    gTimeline.
      selectAll("circle").
      data(gridData.topics).
        enter().
        append("circle").
        attr("class", function (d,i) {
          if(data.topics[i].timeline){
             return  (data.topics[i].timeline.current ? t('timeline.current') : (data.topics[i].timeline.covered ? t('timeline.covered') : ""));
          }
          return "";
        }).
        attr("cx", function (d,i) {
          if(data.topics[i].timeline){
              return  (data.topics[i].timeline.current ? 3 : 2);
          }
          return 2;
        }).
        attr("cy", 0).
        attr("r", function (d,i) {
          if (i ===  0) return 0;
          if(data.topics[i].timeline){
              return  (data.topics[i].timeline.current ? 6 : 3);
          }  
          
          return 4;
        }).
        attr("transform", function (d,i) {
          if ($.inArray(i, gridData.sepX) !== -1) { circleX += settings.sepX; }
          circleX += (i === 0 ? 0 : sqW * visGetTopicSize(data.topics[i-1]) + settings.sq.padding);
          return "translate(" + (circleX) + ",0)";
        }).
        style("shape-rendering", "geometricPrecision");
    
    var txtX = (!visDoVaryCellW() ? (sqW / 2) : 6);  // the x-coordinate of the text label being drawn
    gTimeline.
      selectAll("text").
      data(gridData.topics).
        enter().
        append("text").
        attr("class", function (d,i) {
          if (i ===  0) return "header";
          if(data.topics[i].timeline){
              return  (data.topics[i].timeline.current ? t('timeline.current') : (data.topics[i].timeline.covered ? t('timeline.covered') : ""));
          }
          return "";
        }).
        attr("x", function (d,i) { return (i === 9 ? 1 : 0); }).
        attr("y", 0).
        style("text-anchor", "middle").
        text(function (d,i) {
          if (i === 0) return state.args.uiGridTimelineTitle;
          return i;
        }).
        attr("transform", function (d,i) {
          if ($.inArray(i, gridData.sepX) !== -1) { txtX += settings.sepX; }
          txtX += (i === 0 ? 0 : sqW * visGetTopicSize(data.topics[i-1]) + settings.sq.padding);
          return "translate(" + (txtX) + ",20)";
        }).
        style("text-rendering", "geometricPrecision");
  }
  
  // (2.10) Events:
  if (isInteractive && state.args.uiShowBarChart && miniVis) {
    svg.
      on("click", null).
      on("mouseover",
        function (miniSvg) {
          return function (e) {ehVisGridMouseOver(e, d3.select(this), miniSvg);};
        }(mini.svg)
      ).
      on("mouseout",
        function (miniSvg) {
          return function (e) {
            ehVisGridMouseOut(e, d3.select(this), miniSvg);
          };
        }(mini.svg)
      );
    
  }
  
  if (isInteractive) {
    if (!(state.args.uiShowBarChart && miniVis)) {
      gGrid.
        selectAll(".grid-cell-outter").
        on("mouseover", function (e) { ehVisGridBoxMouseOver(e, d3.select(this), gridData, null, null); }).
        on("mouseout", function (e) { ehVisGridBoxMouseOut(e, d3.select(this), null); }).
        on("click", function (e) { ehVisGridBoxClick(e, d3.select(this)); });
    }
    else {
      gGrid.
        selectAll(".grid-cell-outter").
        on("mouseover",
          function (gridData, miniSvg, miniSeries) {
            return function (e) {
              ehVisGridBoxMouseOver(e, d3.select(this), gridData, miniSvg, miniSeries);
            };
          }(gridData, mini.svg, mini.series)
        ).
        on("mouseout",
          function (miniSvg) {
            return function (e) {
              ehVisGridBoxMouseOut(e, d3.select(this), miniSvg);
            };
          }(mini.svg)
        ).
        on("click", function (e) { ehVisGridBoxClick(e, d3.select(this)); });
    }
    
  }
  
  return svg;
}

function checkIfTopicUnlocked(topicId) {
  return !data.topics[topicId].locked
}

function checkIfTopicUnlockedByName(topicName) {
  var topicUnlocked = true;
  var topic = data.topics.filter(function(d){return d.id==topicName;})[0]
  if(topic && topic.locked){
    topicUnlocked=false;
  }
  return topicUnlocked;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Returns the width size of the grid cell being a proportion of the height, i.e., <0,1>.  If the width 
 * turns out to be smaller than the minimum that minimum is returned instead.
 */
function visGetTopicSize(topic) {
  if (!visDoVaryCellW()) return 1;
  
  var size = topic[state.vis.topicSize.attr];
  return (size <= CONST.vis.minCellSizeRatio ? CONST.vis.minCellSizeRatio : size);
}


// ------------------------------------------------------------------------------------------------------
function ehVisGridMouseOver(e, g, miniSvg) {
    
    miniSvg.setVis(true, 0, 250);
}


// ------------------------------------------------------------------------------------------------------
function ehVisGridMouseOut(e, g, miniSvg) {
  miniSvg.setVis(false, 0, 250);
}


// ------------------------------------------------------------------------------------------------------
function ehVisGridBoxMouseOver(e, grpOutter, gridData, miniSvg, miniSeries) {
  var grpOutterNode = grpOutter.node();
  var grpInner      = grpOutter.select(".grid-cell-inner");
  var box           = grpInner.selectAll(".box");
  var topicIdx      = +grpOutter.attr("data-topic-idx");
  var cellIdx       = +grpOutter.attr("data-cell-idx");
  var gridName      = grpOutter.attr("data-grid-name");
  
  var cx = box.attr("width")  / 2;
  var cy = box.attr("height") / 2;
  
  /*
  for (var i=0, ni=box.node().parentNode.childNodes.length; i < ni; i++) {
    var child = box.node().parentNode.childNodes[i];
    if (child === box.node()) continue;
    d3.select(child).attr("filter", "url(#blur)");
  }
  */
  
  grpOutterNode.parentNode.appendChild(grpOutterNode);  // make the first element to move to top
  
  if (state.args.uiGridActLstMode) {
    grpInner.
      transition().delay(0).duration(100).ease("easeInOutQuart").
      attrTween("transform", function (d,i,a) {
        if (!visDoVaryCellW()) {
          return d3.interpolateString("rotateX(0," + cx + "," + cy + ")", "rotate(45," + cx + "," + cy + ")");
        }
      });
    
    box.
      transition().delay(0).duration(100).ease("easeInOutQuart").
      attr("rx", 1).  // TODO: Change for 0 in chrome (Safari fucks up corners with 0)
      attr("ry", 1).
      style("stroke", "black").
      attr("filter", "url(#shadow)");
  }
  
  else {
    if (state.vis.grid.cellIdxSel !== cellIdx) {
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotateX(0," + cx + "," + cy + ")", "rotate(45," + cx + "," + cy + ")");
          }
        });
      
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("rx", 1).  // TODO: Change for 0 in chrome (Safari fucks up corners with 0)
        attr("ry", 1).
        style("stroke", "black").
        attr("filter", "url(#shadow)");
    }
    else {
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotateX(0," + cx + "," + cy + ")", "rotate(45," + cx + "," + cy + ")");
          }
        });
        
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("filter", "url(#shadow)");
    }
  }
  
  if (miniSvg) {
    miniSvg.
      setTitle(grpOutter.attr("data-var-name")).
      updSeries("pri", gridData, parseInt(grpOutter.attr("data-series-idx"))).
      setSeriesItemClass("pri", "").
      setSeriesItemClass("pri", "l-gray", [+grpOutter.attr("data-idx")]);
  }
  
  // Show the activities list for the cell being moused-over if LMB is held down:
  if (state.args.uiGridActLstMode && state.isMouseBtn1) {
    if ((gridName === "me" || gridName === "mevsgrp" || gridName === "grp")) {
      if (topicIdx === state.vis.topicIdx && state.vis.grid.name === gridName) return;  // the already-selected topic has been clicked (and on the same grid at that)
      
      state.vis.grid.cellIdxSel = cellIdx;
      state.vis.grid.cellSel    = grpOutter;
      state.vis.topicIdx        = topicIdx;
      state.vis.grid.name       = gridName;
      
      if (state.vis.topicIdx === 0) return actLstHide();  // the average topic has been clicked or the already-selected topic has been clicked
      
      return actLstShow(gridName === "me", gridName === "mevsgrp", gridName === "grp");
    }
  }else{
      //return actLstHide(); 
  }
}


// ------------------------------------------------------------------------------------------------------
function ehVisGridBoxMouseOut(e, grpOutter, miniSvg) {
  var grpOutterNode = grpOutter.node();
  var grpInner      = grpOutter.select(".grid-cell-inner");
  var box           = grpInner.selectAll(".box");
  var cellIdx       = +grpOutter.attr("data-cell-idx");
  var gridName      = grpOutter.attr("data-grid-name");
  
  var cx = box.attr("width")  / 2;
  var cy = box.attr("height") / 2;
  
  /*
  for (var i=0, ni=box.node().parentNode.childNodes.length; i < ni; i++) {
    var child = box.node().parentNode.childNodes[i];
    d3.select(child).attr("filter", "");
  }
  */
  
  // (1) Activities list mode:
  if (state.args.uiGridActLstMode) {
    if ((gridName === "act_me" || gridName === "act_mevsgrp" || gridName === "act_grp") && state.vis.grid.cellIdxSel === cellIdx) {  // this if-else is reversed from the one in part (2)
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotate(45," + cx + "," + cy + ")", "rotate(0," + cx + "," + cy + ")");
          }
        });
      
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("filter", "");
    }
    else {
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotate(45," + cx + "," + cy + ")", "rotate(0," + cx + "," + cy + ")");
          }
        });
      
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("rx", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
        attr("ry", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
        style("stroke", "").
        attr("filter", "");
    }
  }
  
  // (2) Activities grid mode:
  else {
    if (state.vis.grid.cellIdxSel !== cellIdx) {
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotate(45," + cx + "," + cy + ")", "rotate(0," + cx + "," + cy + ")");
          }
        });
      
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("rx", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
        attr("ry", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
        style("stroke", "").
        attr("filter", "");
    }
    else {
      grpInner.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attrTween("transform", function (d,i,a) {
          if (!visDoVaryCellW()) {
            return d3.interpolateString("rotate(45," + cx + "," + cy + ")", "rotate(0," + cx + "," + cy + ")");
          }
        });
      
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("filter", "");
    }
  }
  
  if (miniSvg) {
    miniSvg.
      //zeroSeries("pri", { sepX: data.sepX, series: miniSeries[grpOutter.attr("data-var-id")] }).
      setSeriesItemClass("pri", "l-gray").
      setVis(false);
  }
}


// ------------------------------------------------------------------------------------------------------
function ehVisGridBoxClick(e, grpOutter) {
  var grpOutterNode = grpOutter.node();
  var grpInner      = grpOutter.select(".grid-cell-inner");
  var box           = grpInner.selectAll(".box");
  var seq           = grpInner.select(".seq");
  var idx           = +grpOutter.attr("data-idx") - 1;
  var topicIdx      = +grpOutter.attr("data-topic-idx");
  var resIdx        = +grpOutter.attr("data-res-idx");
  var actIdx        = +grpOutter.attr("data-act-idx");
  var cellIdx       = +grpOutter.attr("data-cell-idx");
  var gridName      = grpOutter.attr("data-grid-name");
  var row           = grpOutter.attr("data-series-idx");
  var topic         = data.topics[topicIdx];
  var res           = data.resources[resIdx];
  var act           = (actIdx === -1 ? null : topic.activities[res.id][actIdx]);
  
  // @@@@ click on cell
  //alert("["+gridName+"]"+"["+row+"]");
  var usrState;
  var grpState;
  
  usrState = "usrTopicState"+ CONST.log.sep02;
  grpState = "grpTopicState"+ CONST.log.sep02;
  
  // JULIO: @@@@@ 
  for (var i = 0; i < data.reportLevels.length; i++){
      usrState += data.reportLevels[i].id + "=" + getMe().state.topics[topic.id].values[res.id][data.reportLevels[i].id]  + (i < data.reportLevels.length-1 ? "|" : "");
      grpState += data.reportLevels[i].id + "=" + getGrp().state.topics[topic.id].values[res.id][data.reportLevels[i].id] + (i < data.reportLevels.length-1 ? "|" : "");
  }
  
  //alert("["+usrState+"]"+"["+grpState+"]");
 
  // (1) Activities list mode:
  if (state.args.uiGridActLstMode) {
    // (1.1) Topics grid:
    if ((gridName === "me" || gridName === "mevsgrp" || gridName === "grp")) {
      if (topicIdx === state.vis.topicIdx && state.vis.grid.name === gridName) return;  // the already-selected topic has been clicked (and on the same grid at that)
      
      state.vis.grid.cellIdxSel = cellIdx;
      state.vis.grid.cellSel    = grpOutter;
      state.vis.topicIdx        = topicIdx;
      state.vis.grid.name       = gridName;
      
      //alert("["+usrState+"]"+"["+grpState+"]");
      
      if (state.vis.topicIdx === 0) return actLstHide();  // the average topic has been clicked or the already-selected topic has been clicked
      log(
              "action"          + CONST.log.sep02 + "grid-topic-cell-select"     + CONST.log.sep01 +
              "cell-topic-id"   + CONST.log.sep02 + getTopic().id       + CONST.log.sep01 +
              "grid-name"       + CONST.log.sep02 + gridName       + CONST.log.sep01 +
              "row"             + CONST.log.sep02 + row + CONST.log.sep01 +
              "resource-id"     + CONST.log.sep02 + res.id + CONST.log.sep01 +
              "sequencing"      + CONST.log.sep02 + grpInner.data()[0].seq +
                                  CONST.log.sep01 + usrState + CONST.log.sep01 + grpState,
              
              true, true
           );
      //State.vis.resIdx is 0 when OVERALL is selected
      if(state.vis.resIdx >= 0){
          if(row == 0) return actLstShow(true,false,false);
          if(row == 1) return actLstShow(false,true,false);
          if(row == 2) return actLstShow(false,false,true);
      }else{
          if(state.args.uiGridMeGrpVis || state.args.uiGridGrpVis)
              return actLstShow(gridName === "me", gridName === "mevsgrp", gridName === "grp");
          else 
              return actLstShow(true, false, false);
      }
      
    }
    
    // (1.2) Activities grid:
    else {
      if (actIdx === -1) return;  // the average activity cell has been clicked
      
      
      
      usrState += CONST.log.sep01 + "usrActState" + CONST.log.sep02;
      grpState += CONST.log.sep01 + "grpActState" + CONST.log.sep02;
      //alert("["+act.id+"]");
      for (var i = 0; i < data.reportLevels.length; i++){
          usrState += data.reportLevels[i].id + "=" + getMe().state.activities[topic.id][res.id][act.id].values[data.reportLevels[i].id]  + (i < data.reportLevels.length-1 ? "|" : "");
          grpState += data.reportLevels[i].id + "=" + getGrp().state.activities[topic.id][res.id][act.id].values[data.reportLevels[i].id] + (i < data.reportLevels.length-1 ? "|" : "");
      }
      
      //alert("["+usrState+"]"+"["+grpState+"]");
      
      // (1.2.1) Deselect the currently selected cell:
      if (state.vis.grid.cellSel !== null) {
        var boxSel = state.vis.grid.cellSel.select(".grid-cell-inner").selectAll(".box");
        var seqSel = state.vis.grid.cellSel.select(".grid-cell-inner").select(".seq");
        
        boxSel.
          transition().delay(0).duration(100).ease("easeInOutQuart").
          attr("rx", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
          attr("ry", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
          style("stroke-width", "1").
          style("stroke", "");
        
        seqSel.style("fill", CONST.vis.colors.me[6][5]);
      }
      
      // (1.2.2) Select the new cell:
      box.
        transition().delay(0).duration(100).ease("easeInOutQuart").
        attr("rx", (!visDoVaryCellW() ? 20 : 0)).
        attr("ry", (!visDoVaryCellW() ? 20 : 0)).
        style("stroke-width", (!visDoVaryCellW() ? 1.51 : 1.51)).
        style("stroke", "black");
      
      seq.style("fill", "#000000");
      
      state.vis.grid.cellIdxSel = cellIdx;
      state.vis.grid.cellSel    = grpOutter;
      
              
      log(
        "action"           + CONST.log.sep02 + "grid-activity-cell-select" + CONST.log.sep01 +
        "grid-name"        + CONST.log.sep02 + gridName                    + CONST.log.sep01 +
        "row"              + CONST.log.sep02 + row                         + CONST.log.sep01 +
        "cell-topic-id"    + CONST.log.sep02 + topic.id                    + CONST.log.sep01 +
        "cell-resource-id" + CONST.log.sep02 + res.id                      + CONST.log.sep01 +
        "cell-activity-id" + CONST.log.sep02 + act.id                      + CONST.log.sep01 + 
        "sequencing"       + CONST.log.sep02 + grpInner.data()[0].seq +
                             CONST.log.sep01 + usrState + CONST.log.sep01 + grpState,
        true, true
      );
      
      if (actIdx !== -1) actOpen(res.id, actIdx);
      
      return;
    }
  }
  
  // (2) Activities grid mode:
  else {
    // (2.1) Select:
    if (state.vis.grid.cellIdxSel !== cellIdx) {
      // (2.1.1) Topic grid -- The average topic has been clicked:
      if (getTopic() === null && idx === -1) return;
      
      // (2.1.2) Topic grid -- A topic has been clicked so we switch to activity grid:
      if (getTopic() === null && idx !== -1) {
        state.vis.grid.cellIdxSel = cellIdx;
        state.vis.grid.cellSel    = grpOutter;
        state.vis.topicIdx        = topicIdx;
        state.vis.grid.name       = gridName;
        
        
        log(
          "action"           + CONST.log.sep02 + "grid-topic-cell-select" + CONST.log.sep01 +
          "grid-name"        + CONST.log.sep02 + gridName                 + CONST.log.sep01 +
          "cell-topic-id"    + CONST.log.sep02 + topic.id                 + CONST.log.sep01 +
          "cell-resource-id" + CONST.log.sep02 + res.id,
          true, true
        );
        
        return visDo(true, true, true);
      }
      
      // (2.1.3) Activity grid -- The average activity has been clicked so we go back to the topic grid:
      if (getTopic() !== null && idx === -1) {
        state.vis.grid.cellIdxSel = -1;
        state.vis.grid.cellSel    = null;
        state.vis.topicIdx        = -1;
        state.vis.grid.name       = null;
        
        //ui.nav.tabs.tabs.find(".ui-tabs-nav").children(0).children(0)[0].innerHTML = "TOPICS";
          // TODO: Set page header
        
        log(
          "action"           + CONST.log.sep02 + "grid-activity-go-back" + CONST.log.sep01 +
          "grid-name"        + CONST.log.sep02 + gridName                + CONST.log.sep01 +
          "cell-topic-id"    + CONST.log.sep02 + topic.id                + CONST.log.sep01 +
          "cell-resource-id" + CONST.log.sep02 + res.id,
          true
        );
        
        return visDo(true, true, true);
      }
      
      // (2.1.4) Activity grid -- An activity has been clicked so we mark it as selected and open it:
      if (getTopic() !== null && idx !== -1) {
        // (1.4.1) Deselect the currently selected cell:
        if (state.vis.grid.cellSel !== null) {
          var boxSel = state.vis.grid.cellSel.select(".grid-cell-inner").selectAll(".box");
          var seqSel = state.vis.grid.cellSel.select(".grid-cell-inner").select(".seq");
          
          boxSel.
            transition().delay(0).duration(100).ease("easeInOutQuart").
            attr("rx", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
            attr("ry", (!visDoVaryCellW() ? state.vis.grid.cornerRadius : 0)).
            style("stroke-width", "1").
            style("stroke", "");
          
          seqSel.style("fill", CONST.vis.colors.me[6][5]);
        }
        
        // (2.1.4.2) Select the new cell:
        box.
          transition().delay(0).duration(100).ease("easeInOutQuart").
          attr("rx", (!visDoVaryCellW() ? 20 : 0)).
          attr("ry", (!visDoVaryCellW() ? 20 : 0)).
          style("stroke-width", (!visDoVaryCellW() ? 1.51 : 1.51)).
          style("stroke", "black");
        
        seq.style("fill", "#000000");
        
        state.vis.grid.cellIdxSel = cellIdx;
        state.vis.grid.cellSel    = grpOutter;
        
        log(
          "action"           + CONST.log.sep02 + "grid-activity-cell-select" + CONST.log.sep01 +
          "grid-name"        + CONST.log.sep02 + gridName                    + CONST.log.sep01 +
          "cell-topic-id"    + CONST.log.sep02 + topic.id                    + CONST.log.sep01 +
          "cell-resource-id" + CONST.log.sep02 + res.id                      + CONST.log.sep01 +
          "cell-activity-id" + CONST.log.sep02 + act.id,
          true, true
        );
        
        if (actIdx !== -1) actOpen(res.id, actIdx);
        
        return;
      }
      
      // Sunburst (randomize to test; old stuff):
      /*
      var r = Math.random();
           if (r < 0.25) visGenSunburst(visGenSunburstData(topic, null, null, ["#eeeeee"].concat(colorbrewer.Blues[6])));
      else if (r < 0.50) visGenSunburst(visGenSunburstData(topic, null, null, ["#eeeeee"].concat(colorbrewer.PuRd[6] )));
      else if (r < 0.75) visGenSunburst(visGenSunburstData(topic, null, null, ["#eeeeee"].concat(colorbrewer.Greys[6])));
      else               visGenSunburst(visGenSunburstData(topic, null, null, colorbrewer.GrpRev[6].concat(["#eeeeee"], colorbrewer.PuRd[6])));
      */
    }
    
    // (2.2) Deselect:
    else {
      grpOutterNode.parentNode.appendChild(grpOutterNode);  // make the first element to move to top
      
      // (2.2.1) Activity grid -- An activity has been clicked so we deselect it:
      if (getTopic() !== null && idx !== -1) {
        box.
          transition().delay(0).duration(100).ease("easeInOutQuart").
          attr("filter", "url(#shadow)").
          attr("rx", 1).  // TODO: Change for 0 in Chrome (Safari fucks up corners with 0)
          attr("ry", 1).
          style("stroke-width", "1").
          style("stroke", "black");
        
        seq.style("fill", CONST.vis.colors.me[6][5]);
      }
      
      state.vis.grid.cellIdxSel = -1;
      state.vis.grid.cellSel    = null;
      
      return;
      
      /*
      $removeChildren(ui.vis.sunburst);
      */
    }
  }
}


// ------------------------------------------------------------------------------------------------------
/**
 * Generates a sunburst visualization.
 * 
 * http://bl.ocks.org/mbostock/4063423
 * http://strongriley.github.io/d3/ex/sunburst.html
 */
function visGenSunburst(sunburstData) {
  var D = {
    name: "A", ratio: 1, val: 4,  // topic
    children: [
      {
        name: "a", ratio: 0.20, val: 2,
        children: [
          { name: "a1", ratio: 0.60, val: 2 },
          { name: "a2", ratio: 0.20, val: 1 },
          { name: "a3", ratio: 0.10, val: 2 },
          { name: "a4", ratio: 0.05, val: 2 },
          { name: "a5", ratio: 0.05, val: 2 }
        ]
      },
      {
        name: "b", ratio: 0.20, val: 4,
        children: [
          { name: "b1", ratio: 0.90, val: 3 },
          { name: "b2", ratio: 0.10, val: 5 }
        ]
      },
      {
        name: "c", ratio: 0.40, val: 6,
        children: [
          { name: "c1", ratio: 0.30, val: 6 },
          { name: "c2", ratio: 0.30, val: 5 },
          { name: "c3", ratio: 0.40, val: 5 }
        ]
      },
      {
        name: "d", ratio: 0.10, val: 6,
        children: [
          { name: "d1", ratio: 0.30, val: 6 },
          { name: "d2", ratio: 0.30, val: 6 },
          { name: "d3", ratio: 0.40, val: 5 }
        ]
      },
      {
        name: "e", ratio: 0.10, val: 6,
        children: [
          { name: "e1", ratio: 0.30, val: 6 },
          { name: "e2", ratio: 0.30, val: 6 },
          { name: "e3", ratio: 0.40, val: 6 }
        ]
      }
    ]
  };
  
  var w = 300;
  var h = 300;
  var r = Math.min(w,h) / 2;
  var color = d3.scale.category20c();
  
  $removeChildren(ui.vis.sunburst);
  
  var svg = d3.
    select(ui.vis.sunburst).
    append("svg").
    attr("width", w).
    attr("height", h).
    append("g").
    attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");
  
  var partition = d3.layout.partition().
    sort(null).
    size([2 * Math.PI, r * r]).
    //value(function (d) { return 1; });
    value(function (d) { return d.ratio; });
  
  var arc = d3.svg.arc().
    startAngle(function (d) { return d.x; }).
    endAngle(function (d) { return d.x + d.dx; }).
    innerRadius(function (d) { return Math.sqrt(d.y); }).
    outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });
  
  var path = svg.
    datum(D).
    selectAll("path").
    data(partition.nodes).
      enter().
      append("path").
      attr("display", function (d) { return d.depth ? null : "none"; }).  // hide the most inner ring
      attr("d", arc).
      style("stroke", "#ffffff").
      style("fill", function (d) { return sunburstData.colorScale[d.val]; }).
      style("fill-rule", "evenodd").
      style("shape-rendering", "geometricPrecision").
      each(stash);
  
  /*
  path.
    data(partition.value(function (d) { return d.ratio; }).nodes).
    transition().
    duration(1500).
    attrTween("d", arcTween);
  */
  
  /*
  d3.selectAll("input").on("change", function change() {
    var value = this.value === "count"
      ? function() { return 1; }
      : function(d) { return d.size; };
    
    path.
      data(partition.value(value).nodes).
      transition().
      duration(1500).
      attrTween("d", arcTween);
  });
  */
  
  // Stash the old values for transition.
  function stash(d) {
    d.x0  = d.x;
    d.dx0 = d.dx;
  }
  
  // Interpolate the arcs in data space.
  function arcTween(a) {
    var i = d3.interpolate({ x: a.x0, dx: a.dx0 }, a);
    return function(t) {
      var b = i(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    };
  }
  
  //d3.select(self.frameElement).style("height", h + "px");
}


// ------------------------------------------------------------------------------------------------------
function visResetAll() {
  // Remove all existing tables which hold visualizations:
  for (var i = 0; i < ui.vis.tbl.length; i++) {
    if (ui.vis.tbl[i]) ui.vis.tbl[i].parentNode.parentNode.removeChild(ui.vis.tbl[i].parentNode);
  }
  ui.vis.tbl = [];
  
  // Activities (old version with the activity loaded into a new tab):
  /*
  $removeChildren(ui.vis.act);
  $hide(ui.vis.act);
  */
  
  // Other:
  state.vis.grid.cellIdxMax = 0;
  state.vis.grid.cellIdxSel = -1;
  state.vis.grid.cellSel    = null;
}


// ------------------------------------------------------------------------------------------------------
function visToggleSeries(name) {
  var svg01 = ui.vis.series[name][0];
  var svg02 = ui.vis.series[name][1];
  
  if (svg01.style.display === "block") {
    $hide(svg01);
    $hide(svg02);
  }
  else {
    $show(svg01);
    $show(svg02);
  }
}

//------------------------------------------------------------------------------------------------------
function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius){
   var results = "";
 
   var angle = Math.PI / arms;
   for (var i = 0; i < 2 * arms; i++){
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? outerRadius : innerRadius;
      
      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;
 
      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0){
         results = currX + "," + currY;
      }
      else{
         results += ", " + currX + "," + currY;
      }
   }
   return results;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateHelp(origin){
    var helpText = "";

    var comparison_metric = get_comparison_metric()
    var capital_comp_metric = capitalizeFirstLetter(comparison_metric) 

    if(origin === "one-res-me-h"){
		    var height = 150;
		 
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.grid', {metric:capital_comp_metric})  + "</h3><p>" + t('help.metric_description.me', {metric:comparison_metric}) + "</p>";
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;'>0%</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#edf8e9; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c7e9c0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#a1d99b; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#74c476; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#31a354; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#006d2c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
                "</tr>";
        helpText += "</table>";
		
		
		if(state.args.uiIncenCheck) {
      let text_messages = incentives.parameters.text_messages
      helpText += "<h3>" + text_messages.help_title + "</h3><img src='./img/credit.png' alt='Full credit' width='15' height='15' style='display:inline;'>" + 
        "<p style='display:inline;'>" + text_messages.full_credit_text + "</p>"+ 
        "<br><img src='./img/half_credit.png' alt='Half credit' width='15' height='15' style='display:inline;'>"+
        "<p style='display:inline;'>" + text_messages.half_credit_text + "</p>"+
        "<br><img src='./img/no_credit.png' alt='No credit' width='15' height='15' style='display:inline;'>"+
        "<p style='display:inline;'>" + text_messages.no_credit_text + "</p>"

			height += 150 + (text_messages.extra_height?text_messages.extra_height:0);
    }
    
    if(state.args.uiGradualTopicOpening) {
      helpText += `<h3>${t('help.topic_opening')}</h3><img src='./img/lock2.png' alt='Full credit' width='15' height='15' style='display:inline;'><p style='display:inline;'> ${t('help.topic_opening_desc')} </p>`
      height += 70;
    }
		
		ui.vis.helpDlg.style.height = height + "px";
    }
    if(origin === "one-res-mevsgrp-h"){
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.comparison_grid') + "</h3><p style='margin-top: 2px;margin-bottom:5px;'>" + 
                    t('help.metric_description.mevsgrp', {metric:comparison_metric, groupName:getComparisonGroupName()}) + "</p>";   
            
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;font-size: 10px;'>" + t('legend.group_plus') + "</td>" +
                "<td style='background-color:#08519c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#3182bd; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#6baed6; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#9ecae1; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c6dbef; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c7e9c0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#a1d99b; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#74c476; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#31a354; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#006d2c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;font-size: 10px;'>" + t('legend.you_plus') + "</td>" +
                "</tr>";
        helpText += "</table>";

        ui.vis.helpDlg.style.height = 160 + "px";
    }
    if(origin === "one-res-grp-h"){
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.group_grid') + "</h3><p>" + t('help.metric_description.grp', {metric:comparison_metric, groupName:getComparisonGroupName()}) + "</p>";
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;'>0%</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#eff3ff; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c6dbef; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#9ecae1; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#6baed6; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#3182bd; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#08519c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
                "</tr>";
        helpText += "</table>";
        //["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
    }
    if(origin === "all-res-me-h"){
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.progress_grid') +"</h3><p style='margin-top: 2px;'>" + t('help.metric.progress_grid_description') + "</p>";
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;'>0%</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#edf8e9; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c7e9c0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#a1d99b; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#74c476; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#31a354; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#006d2c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
                "</tr>";
        helpText += "</table>";
    }
    if(origin === "all-res-mevsgrp-h"){
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.comparison_grid') + "</h3><p style='margin-top: 2px;margin-bottom:5px;'>" +
                    t('help.comparison_grid_description') + "</p>";  
                        
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;font-size: 10px;'>group +</td>" +
                "<td style='background-color:#08519c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#3182bd; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#6baed6; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#9ecae1; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c6dbef; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c7e9c0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#a1d99b; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#74c476; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#31a354; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#006d2c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;font-size: 10px;'>you +</td>" +
                "</tr>";
        helpText += "</table>";
    }
    if(origin === "all-res-grp-h"){
        helpText = "<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>" + t('help.metric.group_progress') + "</h3><p>" + t('help.group_progress_description') + "</p>";        
        helpText += "<table border=0 cellpadding=0 cellspacing=0>";
        helpText += "<tr>" +
                "<td style='padding:2px 5px 2px 0px;'>0%</td>" +
                "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#eff3ff; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#c6dbef; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#9ecae1; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#6baed6; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#3182bd; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='background-color:#08519c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
                "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
                "</tr>";
        helpText += "</table>";
    }

    if(origin === "extra_points") {
      helpText = `<h3 style='margin: 0px; padding: 0px 10px 0px 0px;'>${t('help.extra_points_announcement')}</h3>` +
                   t('help.extra_points_description')+ "</p>"; 
      ui.vis.helpDlg.style.height = "170px"
    }

    if(origin === "Animated Examples"){
      var height = 140;
      if(state.curr.grp.includes("CMPUT175Spring2023")){ 
        helpText = "<b>" + t('help.animated_examples_not_graded') + "</b>"
        height += 20
      }
      helpText += "<p>" + t('help.animated_examples_desc') + "</p>";
      
      helpText +=  get_report_level_color_scale(is_report_level_progress(), t('help.progress'))
      
      ui.vis.helpDlg.style.height = height+"px";
    }

    if(origin === "Examples-Challenges"){
      var height = 150;
      helpText = "<p>" +t('help.examples_challenges_desc') + "</p>"
      
      helpText +=  get_report_level_color_scale(is_report_level_progress(), t('help.progress'))
      
      ui.vis.helpDlg.style.height = height+"px";
    }
    
    if(origin === "Tracing Problems"){
      var height = 140;
      helpText = "<p>" + t('help.tracing_problems_desc');

      if(is_report_level_progress()) {
        helpText += "<b>" + comparison_metric + "</b>. " + 
          t('help.progress_desc', {metric:comparison_metric}) + "</p>"
      
        helpText +=  get_report_level_color_scale(true, capital_comp_metric)
      } else {
        helpText += t('help.both_desc') + "</p>"
        
            helpText += get_report_level_color_scale(false, t('help.progress'))
            helpText += get_report_level_color_scale(true, capital_comp_metric)
        height += 220
      }
    
      ui.vis.helpDlg.style.height = height+"px";
    }

    if(origin === "Parsons Problems"){
      var height = 140;
      helpText = "<p>" + + t('help.parsons_problems_desc'); 
      
      if(is_report_level_progress()) {
        helpText += "<b>" + comparison_metric + "</b>. " + 
            t('help.progress_desc', {metric:comparison_metric}) + "</p>"
      
        helpText +=  get_report_level_color_scale(true, capital_comp_metric)
      } else {
        helpText +=  t('help.both_desc') + "</p>"
        
            helpText += get_report_level_color_scale(false, t('help.progress'))
            helpText += get_report_level_color_scale(true, capital_comp_metric)
        height += 220
      }
      
      ui.vis.helpDlg.style.height = height+"px";
    }

    if(origin === "Coding"){
      var height = 140;
      helpText = "<p>" + t('help.coding_desc');
      
      if(is_report_level_progress()) {
        helpText += "<b>" + comparison_metric + "</b>. " + 
           t('help.progress_desc', {metric:comparison_metric}) + "</p>"
      
        helpText +=  get_report_level_color_scale(true, capital_comp_metric)
      } else {
        helpText += t('help.both_desc') + "</p>"
        
            helpText += get_report_level_color_scale(false, t('help.progress'))
            helpText += get_report_level_color_scale(true, capital_comp_metric)
        height += 220
      }
      
      ui.vis.helpDlg.style.height = height+"px";
    }

    return helpText;
}

function get_report_level_color_scale(report_progress, color_scale_label) {
  var helpText = "<table border=0 cellpadding=0 cellspacing=0>";
  
  if(report_progress) {
    helpText += progressColorScaleHelpText(color_scale_label)
  } else {
    helpText += performanceColorScaleHelpText(color_scale_label)
  }
  
  helpText += "</table>";
  
  return helpText
} 

function progressColorScaleHelpText(color_scale_label) {
  return "<tr>" +
      "<td style='padding:2px 5px 2px 0px;'><b>" + color_scale_label + "</b>: 0%</td>" +
      "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='background-color:#c7e9c0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='background-color:#a1d99b; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='background-color:#74c476; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='background-color:#31a354; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='background-color:#006d2c; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
      "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
      "</tr>" 
}

function performanceColorScaleHelpText(color_scale_label) {
  return "<tr>" +
  "<td style='padding:2px 5px 2px 0px;'><b>" + color_scale_label + "</b>: 0%</td>" +
    "<td style='background-color:rgb(238, 238, 238); padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='background-color:#d4b9da; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='background-color:#c994c7; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='background-color:#df65b0; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='background-color:#dd1c77; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='background-color:#980043; padding:2px 5px 2px 5px;'>&nbsp;</td>" +
    "<td style='padding:2px 0px 2px 5px;'>100%</td>" +
    "</tr>";
}

jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("click");
    e.dispatchEvent(evt);
  });
};
