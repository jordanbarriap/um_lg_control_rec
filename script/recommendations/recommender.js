//Topics which have activities that should not be recommended
var non_recommended_topics = ["Table Creation", "Table Deletion and Alteration", "Key Constraints", "Tuple Insertion", "Tuple Deletion", "Tuple Update", "General Constraints", "Derived Relations and Views"];
var proficiency_threshold = .5;
var topic_progress_limit = .1
var last_success_rate_limit = .5
var success_rate_limit = .5
var knowledge_level_limit = .5
var max_num_recs = 9

//Threshold and definitions for the explanations
var mastery_concepts = 0;
var mastery_threshold = .95;
var proficiency_concepts = 0;
var proficiency_threshold = .75;
var good_concepts = 0;
var good_threshold = .5;
var ok_concepts = 0;


function generateLearningPathGraph(learningPathObj, containerId = 'learning-path-graph') {
    // Remove previous graph if exists
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }
	container.style.display = 'block'; // Ensure container is visible
    container.innerHTML = '';

	let main_container = document.getElementById("learning-path-section");
	main_container.style.display = 'block'; // Ensure container is visible

    // SVG setup
    const svgNS = "http://www.w3.org/2000/svg";
    const width = 1000;
    const nodeRadius = 15;
    const nodeMargin = 20;
    const colMargin = 80;
    const arrowColor = "#888";
    const heightPadding = 30;
    const labelHeight = 16;

    // Parse and sort columns by order
    const columns = Object.entries(learningPathObj)
        .map(([id, obj]) => ({ id, order: obj.order, recs: obj.recs }))
        .sort((a, b) => a.order - b.order);

    // Calculate max column height
    const maxColHeight = Math.max(...columns.map(col => col.recs.length));
    const svgHeight = maxColHeight * (2 * nodeRadius + nodeMargin) + heightPadding + labelHeight;
    const svgWidth = columns.length * (2 * nodeRadius + colMargin) + colMargin;

    // Create SVG
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.style.background = "#fff";
    container.appendChild(svg);

    // Store node positions for drawing arrows
    const nodePositions = [];

    columns.forEach((col, colIdx) => {
        const x = colMargin + colIdx * (2 * nodeRadius + colMargin) + nodeRadius;
        const recs = col.recs;
        nodePositions[colIdx] = [];

        // Column label (resource/activity type)
        const colLabel = document.createElementNS(svgNS, "text");
        colLabel.setAttribute("x", x);
        colLabel.setAttribute("y", labelHeight - 8);
        colLabel.setAttribute("text-anchor", "middle");
        colLabel.setAttribute("font-size", "16px");
        colLabel.setAttribute("fill", "#333");
        colLabel.setAttribute("font-weight", "bold");
        colLabel.textContent = col.id;
        svg.appendChild(colLabel);

        // Draw nodes (bottom to top)
       // ...inside generateLearningPathGraph, in the forEach where nodes are created...
		for (let i = 0; i < recs.length; i++) {
			const y = svgHeight - ((i + 1) * (2 * nodeRadius + nodeMargin));
			// Node circle
			const circle = document.createElementNS(svgNS, "circle");
			circle.setAttribute("cx", x);
			circle.setAttribute("cy", y);
			circle.setAttribute("r", nodeRadius);
			circle.setAttribute("fill", "#2196f3");
			circle.setAttribute("stroke", "#1565c0");
			circle.setAttribute("stroke-width", "2");

			// Show explanation as tooltip on mouseover
			const explanation = recs[i].explanation || "";
			circle.addEventListener("mouseenter", function() {
				circle.setAttribute("title", explanation);
			});

			svg.appendChild(circle);

			// Sequential order label (1, 2, 3, ...)
			const seqLabel = document.createElementNS(svgNS, "text");
			seqLabel.setAttribute("x", x);
			seqLabel.setAttribute("y", y - nodeRadius - 8);
			seqLabel.setAttribute("text-anchor", "middle");
			seqLabel.setAttribute("font-size", "13px");
			seqLabel.setAttribute("fill", "#666");
			seqLabel.textContent = (i + 1);
			svg.appendChild(seqLabel);

			// Node label (activity name/id)
			const label = document.createElementNS(svgNS, "text");
			label.setAttribute("x", x);
			label.setAttribute("y", y + 6);
			label.setAttribute("text-anchor", "middle");
			label.setAttribute("font-size", "13px");
			label.setAttribute("fill", "#fff");
			label.textContent = recs[i].name || recs[i].id || `Activity ${i + 1}`;

			// Show explanation as tooltip on mouseover for label
			label.addEventListener("mouseenter", function() {
				label.setAttribute("title", explanation);
			});

			svg.appendChild(label);

			// Save position for arrows
			nodePositions[colIdx].push({ x, y, radius: nodeRadius });
		}
    });

    // Draw arrows within each column (bottom to top)
    columns.forEach((col, colIdx) => {
        for (let i = 0; i < nodePositions[colIdx].length - 1; i++) {
            const from = nodePositions[colIdx][i];
            const to = nodePositions[colIdx][i + 1];
            drawArrow(svg, from.x, from.y - from.radius, to.x, to.y + to.radius, arrowColor);
        }
    });

    // Draw arrows between columns (top of previous to bottom of next)
    for (let colIdx = 0; colIdx < columns.length - 1; colIdx++) {
        const prevCol = nodePositions[colIdx];
        const nextCol = nodePositions[colIdx + 1];
        if (prevCol.length > 0 && nextCol.length > 0) {
            const from = prevCol[prevCol.length - 1]; // top node of previous column
            const to = nextCol[0]; // bottom node of next column
            drawArrow(svg, from.x, from.y - from.radius, to.x, to.y + to.radius, "#43a047");
        }
    }

    // Helper to draw an arrow between two points
    function drawArrow(svg, x1, y1, x2, y2, color = "#888") {
        const arrow = document.createElementNS(svgNS, "line");
        arrow.setAttribute("x1", x1);
        arrow.setAttribute("y1", y1);
        arrow.setAttribute("x2", x2);
        arrow.setAttribute("y2", y2);
        arrow.setAttribute("stroke", color);
        arrow.setAttribute("stroke-width", "3");
        arrow.setAttribute("marker-end", "url(#arrowhead)");
        svg.appendChild(arrow);
    }

    // Add arrowhead marker definition
    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");
    const arrowPath = document.createElementNS(svgNS, "path");
    arrowPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
    arrowPath.setAttribute("fill", "#888");
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

	
}

// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Fill knowledge gaps
 * Generate a list of content covering concepts that the student has not yet attempted
 * or where the student has not shown or modified their proficiency. Hence priority is given 
 * to examples first and then more complex content
**/
function prepareFillKnowledgeGapsRecommendations(){
	sortKCSByLearningGoal(1)
	setTopConceptsForRecommendations(5);
}

function prepareRemedialRecommendations(){
	//check if there are concepts that can be target for recommendation first, if not show modal message
	sortKCSByLearningGoal(0)
	var target_difficult_concepts = data.kcs.filter(kc => !kc.disabledForRec);
	if(target_difficult_concepts.length>0){
		setTopConceptsForRecommendations(5);
	}else{
		var errorMsg = LANGUAGES[state.curr.lang].remedialNotMeaningfulMsg;
		showCustomModal(errorMsg);
		document.querySelector('input[name="learning-goals"][value="RemedialRecommendations"]').checked = false;
		log(
              "action" + CONST.log.sep02 + "lg-unselected" + CONST.log.sep01 +
              "lg-name" + CONST.log.sep02 + state.args.learningGoal + CONST.log.sep01+
              "orig" + CONST.log.sep02 + "system" + CONST.log.sep01,
              false
          );
		
		var div_kcs = document.querySelector("#concept-selection-options")
		div_kcs.style.disabled = true;
		div_kcs.style.filter = 'blur(3px)';
		div_kcs.style.pointerEvents = 'none';
		
		const lg_div = document.querySelector('div.learning-goal-option.'+ state.args.learningGoal);
    	lg_div.setAttribute('aria-pressed', 'false');

		state.args.learningGoal = "";

	}
	
}

function prepareKeepMeUpWithTheClassRecommendations(){
	sortKCSByLearningGoal(2)
	setTopConceptsForRecommendations(5);
}

function generateFillKnowledgeGapsRecommendations(data_topics_acts_kcs, user_state, kc_topic_weights, weight_kcs, weight_proficiency,selected_kcs_ids){
	var recommendations = [];
	var topics = data_topics_acts_kcs;
	var n_topics = topics.length;

	var selected_kcs_ids = data.kcs.filter(function(d){return !d.disabledForRec && d.selectedForRec}).map(function(d){return d.id});
	console.log("Selected kcs ids for fill knowledge gaps recommendations:");
	console.log(selected_kcs_ids);

	var ranking_acts_per_type = {}
	var unique_list_rec_activities = []

	for(var i=1; i<n_topics;i++){
		var topic = topics[i];
		//var topic_name = topic.name;
		var topic_name = topic.id;
		var resources = Object.keys(topic.activities);
		var n_resources = resources.length;
		
		var topic_activities = user_state["activities"][topic_name];
		for (var j=0; j<n_resources;j++){
			var resource_id = resources[j];
			console.log(resource_id)
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			var ranking_act_curr_type = []
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var covered = kcs.filter(function(kc_id) {
					return selected_kcs_ids.includes(kc_id);
				});

				var ratio_covered_selected_kcs = selected_kcs_ids.length > 0 ? covered.length / selected_kcs_ids.length : 0;
				activity.ratio_covered_selected_kcs = ratio_covered_selected_kcs;

				activity.topic_name = topic_name;
				activity.topic_id = i;
				sample_covered_concepts = covered.slice(0,3).map(function(d){return data.kcs.filter(function(kc){return kc.id==d})[0].n})
				explanation = ""
				//Explanations about the target concepts covered
				ratio_covered_selected_kcs = activity.ratio_covered_selected_kcs
				if(ratio_covered_selected_kcs==1){
					explanation+=LANGUAGES[state.curr.lang].FillKnowledgeGapsRecommendationsExpLabel1+"<span class='text-highlighted-kcs'>"+convertKCNamesToCurrentLanguage(sample_covered_concepts)+")</span>.";
				}else{
					if(ratio_covered_selected_kcs>=0.5){
						explanation+=LANGUAGES[state.curr.lang].FillKnowledgeGapsRecommendationsExpLabel2+"<span class='text-highlighted-kcs'>"+convertKCNamesToCurrentLanguage(sample_covered_concepts)+")</span>.";
					}else{
						if(ratio_covered_selected_kcs>0.25){
							explanation+=LANGUAGES[state.curr.lang].FillKnowledgeGapsRecommendationsExpLabel3+"<span class='text-highlighted-kcs'>"+convertKCNamesToCurrentLanguage(sample_covered_concepts)+")</span>.";
						}else{
							if(ratio_covered_selected_kcs>0.0){
								explanation+=LANGUAGES[state.curr.lang].FillKnowledgeGapsRecommendationsExpLabel4+"<span class='text-highlighted-kcs'>"+convertKCNamesToCurrentLanguage(sample_covered_concepts)+")</span>.";
							}
						}
					}
				}
				activity.explanation = explanation;
				if(ratio_covered_selected_kcs>0){//if it does not cover at least one of the selected kcs, it is not considered for recommendation
					ranking_act_curr_type.push(activity);
					unique_list_rec_activities.push(activity);
				}
			}
			console.log("current type")
			console.log(ranking_act_curr_type)

			if (resource_id in ranking_acts_per_type){
				ranking_acts_per_type[resource_id] = ranking_acts_per_type[resource_id].concat(ranking_act_curr_type);
			}else{
				ranking_acts_per_type[resource_id] = ranking_act_curr_type;
			}
		}
	}
	
	//sort each of the activities per source based on different criteria
	//0. if not an example and not a quizpet, the candidate for recommendation should be activities that have not been solved correctly in the past (p different than 1)
	//1. Sort by ratio of covered selected kcs (higher the better) -> done
	//2. Student should not be proficient in the target covered selected kcs (the lowest avg knowledge the better) -> pending
	//3. Higher avg level of proficiency in the non-target covered selected kcs (the higher the better) -> done
	//4. Priority if the activity covers one or more concepts of the week

	// After all activities have been pushed to unique_list_rec_activities and before sorting:
	unique_list_rec_activities.forEach(function(activity) {
		// Get non-target KCs (those not in selected_kcs_ids)
		var non_target_kcs = activity.kcs.filter(function(kc_id) {
			return !selected_kcs_ids.includes(kc_id);
		});

		// Calculate average uk for non-target KCs
		var avg_uk_non_target = 0;
		if (non_target_kcs.length > 0) {
			var sum_uk = 0;
			for (var nt = 0; nt < non_target_kcs.length; nt++) {
				var kc_obj = data.kcs.find(function(d) { return d.id == non_target_kcs[nt]; });
				sum_uk += kc_obj && typeof kc_obj.uk === 'number' ? kc_obj.uk : 0;
			}
			avg_uk_non_target = sum_uk / non_target_kcs.length;
		}
		activity.avg_uk_non_target = avg_uk_non_target;
		console.log("Activity " + activity.id + " avg_uk_non_target: " + avg_uk_non_target);
		
		explanation_other_kcs_part=activity.explanation
		if(avg_uk_non_target>=mastery_threshold){
			explanation_other_kcs_part+=LANGUAGES[state.curr.lang].ProficiencyExpLabel1;
		}else{
			if(avg_uk_non_target>=proficiency_threshold){
				explanation_other_kcs_part+=LANGUAGES[state.curr.lang].ProficiencyExpLabel2;
			}else{
				if(avg_uk_non_target>=good_threshold){
					explanation_other_kcs_part+=LANGUAGES[state.curr.lang].ProficiencyExpLabel3;
				}else{
					explanation_other_kcs_part+=LANGUAGES[state.curr.lang].ProficiencyExpLabel4;
				}
			}
		}
		//Add the explanations about the concepts covered and overall proficiency in other topics
		activity.explanation = explanation_other_kcs_part;

		// Calculate weighted rank score
		activity.rec_score = weight_kcs * activity.ratio_covered_selected_kcs + weight_proficiency * avg_uk_non_target;
	});

	// Now sort by rec_score descending
	unique_list_rec_activities.sort(function(a, b) {
		return (b.rec_score || 0) - (a.rec_score || 0);
	});


	// for (var resource_id in ranking_acts_per_type){
	// 	var ranking_acts = ranking_acts_per_type[resource_id];
	// 	// Sort by ratio_covered_selected_kcs descending
	// 	ranking_acts.sort(function(a, b) {
	// 		return (b.ratio_covered_selected_kcs || 0) - (a.ratio_covered_selected_kcs || 0);
	// 	});
	// 	ranking_acts_per_type[resource_id] = ranking_acts;
	// 	console.log(resource_id + " ranking activities:");
	// 	console.log(ranking_acts_per_type[resource_id])
	// }

	// console.log("Ranking activities per type:");
	// console.log(ranking_acts_per_type)
	// //Ejecucion -> quizpet
	// //ee615 -> pcex examples
	// //rec582 -> parsons
	// const max_num_rec_quizpet=2
	// const max_num_rec_examples=3
	// const max_num_rec_challenges=2
	// const max_num_rec_parsons=2
	// const max_num_rec_pcrs =2

	// //final order in the recommended learning path
	// var final_recs ={"Ejecucion":{"order":1},"Ejemplos explicados":{"order":0},"rec582":{"order":2},"Codificacion":{"order":4},"Completa el codigo":{"order":3}}

	// for (var resource_id in ranking_acts_per_type){
	// 	var ranking_acts = ranking_acts_per_type[resource_id];
	// 	var resource_rec_acts =[]
	// 	console.log(resource_id + " final recommended activities:");
	// 	if (ranking_acts.length>0){
	// 		console.log("Max num recs for " + resource_id + ": " + ranking_acts.length);
	// 		if (resource_id.includes("Quizpet") || resource_id.includes("Ejecucion") || resource_id.includes("ee615")){
	// 			max_num_recs = max_num_rec_quizpet
	// 		}
	// 		if (resource_id.includes("Example") || resource_id.includes("Ejemplos explicados") || resource_id.includes("ee615")){
	// 			max_num_recs = max_num_rec_examples
	// 		}
	// 		if (resource_id.includes("Parson") || resource_id.includes("rec582")){
	// 			max_num_recs = max_num_rec_parsons
	// 		}
	// 		if(resource_id.includes("Codificacion")){
	// 			max_num_recs = max_num_rec_pcrs
	// 		}
	// 		if(resource_id.includes("Completa el codigo")){
	// 			max_num_recs = max_num_rec_challenges
	// 		}
	// 		for(var i=0;i<ranking_acts.length && i<max_num_recs;i++){
	// 			console.log(i)
	// 			var rec_explanation = "This activity is recommended because it covers <b>"+ranking_acts[i].ratio_covered_selected_kcs+"</b> of the concept(s) that you have not attempted yet.";
	// 			if (resource_id.includes("Quizpet") || resource_id.includes("Ejecucion")){
	// 				rec_explanation = rec_explanation + " It is an example that will help you understand these concepts better.";
	// 			}
	// 			if (resource_id.includes("Example") || resource_id.includes("ee615") || resource_id.includes("Ejemplos explicados")){
	// 				rec_explanation = rec_explanation + " It is an example that will help you understand these concepts better.";
	// 			}
	// 			if (resource_id.includes("Parson") || resource_id.includes("rec582")){
	// 				rec_explanation = rec_explanation + " It is a parsons problem that will help you practice these concepts.";
	// 			}
	// 			if (resource_id.includes("Codificacion")){
	// 				rec_explanation = rec_explanation + " It is a coding problem that will help you practice these concepts.";
	// 			}
	// 			if (resource_id.includes("Completa el codigo")){
	// 				rec_explanation = rec_explanation + " It is a code completion problem that will help you practice these concepts.";
	// 			}
	// 			ranking_acts[i].explanation = rec_explanation;
	// 			resource_rec_acts.push(ranking_acts[i]);
	// 		}
	// 	}
	// 	var recs_obj = final_recs[resource_id]
	// 	console.log(recs_obj)
	// 	recs_obj["recs"]=resource_rec_acts
	// 	final_recs[resource_id]=recs_obj
	// }
	// console.log("Final recommendations for fill knowledge gaps:");
	// console.log(final_recs)
	return unique_list_rec_activities

}




// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Remedial
 * Generate a list of recommended content list based on problematic concepts and  
 * knowledge level infered for kcs
 */
// function generateRemedialRecommendations(data_topics_acts_kcs, user_state, kc_topic_weights, weight_kcs, weight_sr){
// 	kc_levels = user_state.kcs
// 	topic_levels = user_state.topics

// 	var filtered_kcs = kc_topic_weights.map(function(d){return d.id});
// 	console.log(filtered_kcs)
// 	//get the ids from the selected kcs
// 	selected_kcs_ids = data.kcs.filter(function(d){return !d.disabledForRec && d.selectedForRec}).map(function(d){return d.id});

// 	//further filter the kc_levels to keep only those that have been selected by the users
// 	// further filter the kc_levels to keep only those that have been selected by the users
// 	filtered_kcs = selected_kcs_ids //filtered_kcs.filter(function(d){ return selected_kcs_ids.includes(d); });

// 	console.log(selected_kcs_ids)
	
	
// 	var filtered_kc_levels = {};
// 	for (var i=0; i<filtered_kcs.length;i++){
// 		var kc_id = filtered_kcs[i];
// 		if (kc_levels.hasOwnProperty(kc_id)) {
//             filtered_kc_levels[kc_id] = kc_levels[kc_id];
//         }
// 	}
  
// 	kc_levels = filtered_kc_levels;
// 	calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr);
// 	var recommendations = [];
// 	var topics = data_topics_acts_kcs;
// 	var n_topics = topics.length;

// 	for(var i=1; i<n_topics;i++){
// 		var topic = topics[i];
// 		//var topic_name = topic.name;
// 		var topic_name = topic.id;
// 		var resources = Object.keys(topic.activities);
// 		var n_resources = resources.length;

// 		var topic_activities = user_state["activities"][topic_name];

// 		if(!non_recommended_topics.includes(topic_name) && topic_levels[topic_name].overall.p >= topic_progress_limit) {
// 			for (var j=0; j<n_resources;j++){
// 				var resource_id = resources[j];
// 				var activities = topic.activities[resource_id];
// 				var n_activities = activities.length;
// 				for (var k=0;k<n_activities;k++){
// 					var activity = activities[k];
// 					var kcs = activity["kcs"];
// 					var rec_score = 0;
// 					var weights_sum = 0;
// 					var helpful_kcs_number = 0;
// 					var problematic_kcs = 0;
// 					var slip_kcs = 0;

// 					var act_progress = topic_activities[resource_id][activity.id].values.p;
	
// 					//Total number of concepts needed for solving the problem / understanding the example
// 					var total_kcs = 0;
// 					var kcs_for_recommendation = []

// 					var misconception_kcs = []
// 					var helpful_kcs = [] 
	
// 					for (var l=0;l<kcs.length;l++){
// 						var kc_id = kcs[l];
// 						if (kc_id in kc_levels){
// 							var kc_diff = kc_levels[kc_id]["diff"];
// 							if(kc_diff>=0){
// 								total_kcs ++;
// 								var kc_weight = topic.concepts.filter(function(d){return d.id==kc_id;})[0].weight;
// 								rec_score = rec_score + (kc_weight*kc_diff);
// 								weights_sum = weights_sum + kc_weight;
	
// 								var kc_level = kc_levels[kc_id]["k"];
// 								var kc_lastksr= kc_levels[kc_id]["lastk-sr"];
// 								var kc_lastk_att = kc_levels[kc_id]["lastk-att"];
// 								var kc_sr = kc_levels[kc_id]["sr"];
// 								var kc_att = kc_levels[kc_id]["a"];
								
// 								if(kc_level>= knowledge_level_limit){
// 									if(kc_att > 0 && kc_sr <= last_success_rate_limit){
// 									//if(kc_lastk_att > 0 && kc_lastksr <= last_success_rate_limit){
// 										misconception_kcs.push({"name": data.kcs.filter(function(d){return d.id == kc_id;})[0].dn , "lastksr": kc_lastksr})
// 										//if (kc_level < proficiency_threshold){
// 										problematic_kcs ++;
// 										//} else{
// 										//	slip_kcs ++;
// 										//}
		
// 										//if (kc_level >= knowledge_level_limit){
// 										kcs_for_recommendation.push(kc_levels[kc_id])
// 										condition_to_generate_recommendations = true;
// 										//}
// 									}
// 									else{// if(kc_level >= knowledge_level_limit){// && (kc_lastksr == -1 || kc_lastksr>.5)){
// 										var helpfulkc = data.kcs.filter(function(d){return d.id == kc_id;})[0]
// 										helpful_kcs.push({"name": helpfulkc.dn , "kclevel": kc_level, "lastksr":kc_lastksr})

// 										helpful_kcs_number ++;
// 									}
// 								}else{
// 									console.log(kc_id + " on-learning concept");

// 								}
								
// 							}
							
// 						}	
// 					}
					

// 					// Only add this activity to the recommended activity list:
// 					// This activity has at least 1 KC which satisfies the following criteria:
// 					// 1. Belong to a topic not listed as non_recommended_topics	  
// 					// 2. Belong to a topic whose average progress is >= topic_progress_limit
// 					// 3. Attempted at least once in last k attempts
// 					// 4. Has knowledge level >= .5
// 					// 5. Has last k success rate <= .5


// 					if(kcs_for_recommendation.length>0){// && act_progress<.5){
// 						if (weights_sum>0){
// 							rec_score = rec_score/weights_sum;//Normalizing rec score with total of the sum of weights (?)
// 						}

// 						misconception_kcs = misconception_kcs.sort((a, b) => (a.lastksr < b.lastksr) ? 1 : -1)
// 						helpful_kcs = helpful_kcs.sort((a, b) => (a.kclevel < b.kclevel) ? 1 : -1)

		
// 						var rec_explanation = "This activity is recommended because:<ul>";
		
// 						if ((problematic_kcs+slip_kcs)>0){
// 							rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concept(s) which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past (e.g. "+misconception_kcs[0].name+").</li>"
// 							//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
// 							// Peter suggested to hide this part of the explanation
// 							// if (slip_kcs){
// 							// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
// 							// }
// 							//rec_explanation = rec_explanation + "<br>";
// 						}
// 						if (helpful_kcs_number>0){
// 							rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs_number+"</b> concept(s)</b> that are necessary to ";//out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
// 							var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 || activity["url"].indexOf("sqltutor")>=0;
// 							var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
// 							if(is_sqlknot){
// 								rec_explanation = rec_explanation + " solve this problem.";
// 							}else{
// 								if(is_example){
// 									rec_explanation = rec_explanation + " understand this example.";
// 								}
// 							}	

// 							rec_explanation = rec_explanation + "(e.g. " + helpful_kcs[0].name + ")</li>"

// 						}
					
// 						rec_explanation = rec_explanation + "</ul>";
	
// 						ranked_activity = Object.assign({}, activity);
// 						ranked_activity["rec_score"] = 1-Math.abs(.5-rec_score);//rec_score;
// 						ranked_activity["topic"] = topic_name;
// 						ranked_activity["explanation"] = rec_explanation;
// 						recommendations.push(ranked_activity);
// 					}
					
// 				}
// 			}
// 		}
// 	}
// 	recommendations.sort(compareActivities);

// 	return recommendations;
// }

/***
Peter's explanation text:
- It allows you to practice X concepts, which might have caused problems in the past
- It is not too complicated for -- you have good knowledge of Y concepts out of Z necessary to solve this problem [or “To understand this example”]
***/

//Newest remedial recommendation for the new interface
function generateRemedialRecommendations(data_topics_acts_kcs, user_state, kc_topic_weights, weight_kcs, weight_sr){
	kc_levels = user_state.kcs
	console.log("kc levels")
	console.log(kc_levels)

	topic_levels = user_state.topics

	var filtered_kcs = kc_topic_weights.map(function(d){return d.id});
	//get the ids from the selected kcs
	selected_kcs_ids = data.kcs.filter(function(d){return !d.disabledForRec && d.selectedForRec}).map(function(d){return d.id});

	//further filter the kc_levels to keep only those that have been selected by the users
	filtered_kcs = selected_kcs_ids //filtered_kcs.filter(function(d){ return selected_kcs_ids.includes(d); });
	
	
	var filtered_kc_levels = {};
	for (var i=0; i<filtered_kcs.length;i++){
		var kc_id = filtered_kcs[i];
		if (kc_levels.hasOwnProperty(kc_id)) {
            filtered_kc_levels[kc_id] = kc_levels[kc_id];
        }
	}
  
	kc_levels = filtered_kc_levels;
	
	var recommendations = [];
	var topics = data_topics_acts_kcs;
	var n_topics = topics.length;

	for(var i=1; i<n_topics;i++){
		var topic = topics[i];
		//var topic_name = topic.name;
		var topic_name = topic.id;
		var resources = Object.keys(topic.activities);
		var n_resources = resources.length;

		var topic_activities = user_state["activities"][topic_name];

		if(!non_recommended_topics.includes(topic_name)){//} && topic_levels[topic_name].overall.p >= topic_progress_limit) {
			for (var j=0; j<n_resources;j++){
				var resource_id = resources[j];
				var activities = topic.activities[resource_id];
				var n_activities = activities.length;
				for (var k=0;k<n_activities;k++){
					var activity = activities[k];
					//console.log("Evaluating activity "+activity.id+" from resource "+resource_id+" in topic "+topic_name);	
					var kcs = activity["kcs"];
					var rec_score = 0;
					var rec_score_prob_kcs = 0;
					var rec_score_other_kcs = 0;
					var weights_sum_problematic_kcs = 0;
					var weights_sum_other_kcs =0;
					var helpful_kcs_number = 0;
					var problematic_kcs = 0;
					var slip_kcs = 0;

					var ratio_covered_selected_kcs = 0.0;
					var act_progress = topic_activities[resource_id][activity.id].values.p;
	
					//Total number of concepts needed for solving the problem / understanding the example
					var total_diff_kcs = 0;
					var kcs_for_recommendation = []
					var misconception_kcs = []
					var helpful_kcs = [] 
					console.log("KCs for this activity:")
					console.log(kcs)
					console.log(activity.name)
	
					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];
						//Weight of the kc in the topic
						//If the kc is not part of the topic, weight = 0
						console.log("Evaluating kc "+kc_id)
						var kc_weight = 0.0;
						if(topic.concepts.filter(function(d){return d.id==kc_id;}).length>0){
							kc_weight = topic.concepts.filter(function(d){return d.id==kc_id;})[0].weight;
						}
						var kc_info = data.kcs.filter(function(d){return d.id == kc_id;})[0]
						if(kc_info!=undefined){
							var kc_level = kc_info["total_uk"];
							var kc_lastksr= kc_info["lastk-sr"];
							var kc_lastk_att = kc_info["lastk-att"];
							var kc_sr = kc_info["sr"];
							var kc_att = kc_info["a"];

							if (kc_id in kc_levels){
								var kc_diff = kc_levels[kc_id]["diff"];
								console.log(kc_id + " diff: "+kc_diff)

								if(kc_diff>=0){
									console.log("difficult kc found "+kc_id)
									total_diff_kcs ++;
									
									rec_score_prob_kcs = rec_score_prob_kcs + (kc_weight*kc_diff);
									weights_sum_problematic_kcs = weights_sum_problematic_kcs + kc_weight;

									//if(kc_level>= knowledge_level_limit){
									if(kc_att > 0 && kc_sr <= success_rate_limit){
									//if(kc_lastk_att > 0 && kc_lastksr <= last_success_rate_limit){
										misconception_kcs.push({"name": data.kcs.filter(function(d){return d.id == kc_id;})[0].n , "lastksr": kc_lastksr, "sr": kc_sr})
										if (kc_level < proficiency_threshold){
											problematic_kcs ++;
										} else{
											slip_kcs ++;
										}
										//if (kc_level >= knowledge_level_limit){
										kcs_for_recommendation.push(kc_levels[kc_id])
										condition_to_generate_recommendations = true;
										//}
									}
									/*}else{
										console.log(kc_id + " on-learning concept");

									}*/
								}
								
							}else{
								console.log("kc "+kc_id+" not in selected kcs");
								if(kc_level >= knowledge_level_limit){// && (kc_lastksr == -1 || kc_lastksr>.5)){
									var helpfulkc = data.kcs.filter(function(d){return d.id == kc_id;})[0]
									helpful_kcs.push({"name": helpfulkc.n , "kclevel": kc_level, "lastksr":kc_lastksr})

									helpful_kcs_number ++;
								}
								rec_score_other_kcs = rec_score_other_kcs + (kc_weight*kc_level);
								weights_sum_other_kcs = weights_sum_other_kcs + kc_weight;

							}	
						}else{
							console.log("kc "+kc_id+" not found in data.kcs");
						}
					}
					//To-do asignar otros pesos a la combinacion de las dos partes del rec score
					console.log("rec score problematic kcs: ")
					console.log(rec_score_prob_kcs)
					console.log("weights sum other kcs: ")
					console.log(rec_score_other_kcs)
					rec_score = (rec_score_prob_kcs/weights_sum_problematic_kcs)*0.5 + (rec_score_other_kcs/weights_sum_other_kcs)*0.5
					console.log("rec score: ")
					console.log(rec_score)
					// OLD algorithm 
					// Only add this activity to the recommended activity list:
					// This activity has at least 1 KC which satisfies the following criteria:
					// 1. Belong to a topic not listed as non_recommended_topics	  
					// 2. Belong to a topic whose average progress is >= topic_progress_limit
					// 3. Attempted at least once in last k attempts
					// 4. Has knowledge level >= .5
					// 5. Has last k success rate <= .5


					if(kcs_for_recommendation.length>0){// && act_progress<.5){
						/*if (weights_sum>0){
							rec_score = rec_score/weights_sum;//Normalizing rec score with total of the sum of weights (?)
						}*/

						misconception_kcs = misconception_kcs = misconception_kcs.sort((a, b) => {
							const aLastksr = typeof a.lastksr === 'number' ? a.lastksr : 0;
							const bLastksr = typeof b.lastksr === 'number' ? b.lastksr : 0;
							const aSr = typeof a.sr === 'number' ? a.sr : 0;
							const bSr = typeof b.sr === 'number' ? b.sr : 0;
							if (aLastksr > 0.0 && bLastksr > 0.0) {
								return bLastksr - aLastksr; // Descending by lastksr
							}
							return bSr - aSr; // Descending by sr if lastksr not available
						});
						helpful_kcs = helpful_kcs.sort((a, b) => (a.kclevel > b.kclevel) ? 1 : -1)

		
						var rec_explanation = "";
		
						if ((problematic_kcs+slip_kcs)>0){
							console.log(misconception_kcs)
							//rec_explanation = rec_explanation + LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel1 +(problematic_kcs + slip_kcs)+LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel2+misconception_kcs[0].name+")"
							rec_explanation = rec_explanation + LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel1 +(problematic_kcs + slip_kcs)+LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel2 + convertKCNamesToCurrentLanguage(misconception_kcs)+")"
							//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
							// Peter suggested to hide this part of the explanation
							// if (slip_kcs){
							// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
							// }
							//rec_explanation = rec_explanation + "<br>";
						}
						if (helpful_kcs_number>0){
							
							rec_explanation = rec_explanation + LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel3+helpful_kcs_number+LANGUAGES[state.curr.lang].RemedialRecommendationsExpLabel4;//out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
							var is_problem = activity["url"].indexOf("sqlknot")>=0 || activity["url"].indexOf("sqltutor")>=0 || activity["url"].indexOf("parson")>=0 || activity["url"].indexOf("quizpet")>=0 || activity["url"].indexOf("pcrs")>=0;
							var is_example = activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae") || activity["url"].indexOf("pcex")>=0;
							/*if(is_problem){
								rec_explanation = rec_explanation + " solve this problem.";
							}else{
								if(is_example){
									rec_explanation = rec_explanation + " understand this example.";
								}
							}*/

							rec_explanation = rec_explanation + convertKCNamesToCurrentLanguage(helpful_kcs.slice(0,3)) + ")</li>"

						}
					
						rec_explanation = rec_explanation + "</ul>";
	
						ranked_activity = Object.assign({}, activity);
						ranked_activity["rec_score"] = rec_score;
						ranked_activity["topic_name"] = topic_name;
						ranked_activity["explanation"] = rec_explanation;
						recommendations.push(ranked_activity);
					}
				}
			}
		}
	}
	//Remove content that belongs to future topics
	recommendations.sort(compareActivities);

	return recommendations;
}

function generateKeepMeUpWithTheClassRecommendations(topics_concepts, topic, topics_activities, kc_levels, kc_topic_weights, weight_kcs){
	
	// Add this after the kc_levels = filtered_kc_levels; line in generateKeepMeUpWithTheClassRecommendations
	// Enrich kc_levels with additional data from data.kcs
	for (let kcId in kc_levels) {
		const matchingKC = data.kcs.find(kc => kc.id == kcId);
		if (matchingKC) {
			kc_levels[kcId].a = matchingKC.a || 0;
			kc_levels[kcId].edition = matchingKC.edition || 0;
			kc_levels[kcId].uk_total = matchingKC.uk_total || 0;
		}
	}
	console.log("kc_levels")
	console.log(kc_levels)

	//Define the outcome and prerequisites for the current topic
	var topicOrder = -1;
	var topic_name = topic.name;
	var topic_name = topic.id;

	var topicInfo = topics_concepts.filter(function(d){
		return d.topicId == topic_name;
	});

	if(topicInfo.length>0){
		topicOrder = topicInfo[0].topicOrder;
	}

	var topic_activities = topics_activities[topic_name];

	var prerequisites = [];
	prerequisites = topics_concepts.filter(function(d){return d.topicOrder < topicOrder});

	for(var i=0; i<prerequisites.length;i++){
		var prerequisite_concept = prerequisites[i];
		kc_levels[prerequisite_concept.conceptId].type = "prerequisite";
	}
	set_prerequisites = new Set(prerequisites.map(function(d){ return d.conceptId}));
	console.log("Set of prerequisites:");
	console.log(set_prerequisites);

	var outcomes =[]
	//outcomes = topics_concepts.filter(function(d){return d.topicOrder == topicOrder});
	const selectedKcIds = data.kcs.filter(kc => kc.selectedForRec === true).map(kc => kc.id);

	outcomes = topics_concepts.filter(function(d){ return selectedKcIds.includes(d.conceptId)});
	for(var i=0; i<outcomes.length;i++){
		var outcome_concept = outcomes[i]
		kc_levels[outcome_concept.conceptId].type = "outcome";
	}
	set_outcomes = new Set(outcomes.map(function(d){ return d.conceptId}));
	console.log("Set of outcomes:");
	console.log(set_outcomes);

	//remove the outcomes (selected by the user) that in the previous algorithm were considered as prerequisites
	prerequisites = prerequisites.filter(function(prereq) {
		return !outcomes.some(function(outcome) {
			return outcome.conceptId === prereq.conceptId;
		})
	});

	// Calculate the weights for outcomes and prerequisite concepts using TF-IDF (boolean in this case as we do not have number of times that concept appears in an activity)
	// starting from idf values
	// Calculate the weights for outcomes and prerequisite concepts using TF-IDF (boolean in this case as we do not have number of times that concept appears in an activity)
	// starting from idf values
	var idf_values = {};
	var prerequisite_idfs = [];
	var outcome_idfs = [];
	var total_acts_prev_topics = topics_concepts.filter(function(d){return d.topicOrder<=topicOrder;}).map(function(d){return d.topicActs;}).reduce(function(a, b) { return a + b; });

	for(var i=0;i<prerequisites.length;i++){
		var prerequisite = prerequisites[i];
		var prerequisite_id = prerequisite.conceptId;
		var prerequisite_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==prerequisite_id)});
		var num_acts_prerequisite = prerequisite_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_prerequisite);
		idf_values[prerequisite_id] = idf_concept;
		prerequisite_idfs.push({'conceptId': prerequisite_id, 'value': idf_concept});
	}

	for(var i=0;i<outcomes.length;i++){
		var outcome = outcomes[i];
		var outcome_id = outcome.conceptId;
		outcomes[i].k = kc_levels[outcome_id].k;
		var outcome_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==outcome_id)});
		var num_acts_outcome = outcome_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_outcome);
		idf_values[outcome_id] = idf_concept;
		outcome_idfs.push({'conceptId': outcome_id, 'value': idf_concept});
	}

	//Sort idf values for generating explanations for km recommendations
	prerequisite_idfs.sort(function(a,b){return b.value-a.value;});
	outcome_idfs.sort(function(a,b){return b.value-a.value;});

	console.log("Prerequisite idf values:");
	console.log(prerequisite_idfs);
	console.log("Outcome idf values:");
	console.log(outcome_idfs)
	console.log("outcomes")
	console.log(outcomes)

	var recommendations = [];
	//var topics = data_topics_acts_kcs;
	//var n_topics = topics.length;

	//If at least one of the kcs have a level > .5, we generate the recommendations
	//var condition_to_generate_recommendations = false;

	// for(var i=1; i<n_topics;i++){
	// var topic = topics[i];
	// var topic_name = topic.name;

	//First we see if there are never attempted outcome concepts
	var num_non_attempted_concepts = 0;
	var non_attempted_concepts = [];
	for(var i=0;i<outcomes.length;i++){
		var outcome_conceptId = outcomes[i].conceptId;
		
		var outcome_concept_k = -1
		var outcome_concept_a=-1
		if('uk_total' in outcomes[i]){
			outcome_concept_k = outcomes[i].uk_total;
			outcome_concept_a = outcomes[i].a;
		}

		//Here we check if a concept has been attempted in a previous activity 
		if((data.configprops.agg_kc_student_modeling=="bn" && outcome_concept_k==.5) || (data.configprops.agg_kc_student_modeling=="cumulate" && outcome_concept_k==0 && outcome_concept_a==0)){//TODO: we should check the real number of attempts instead the kc level given by bn_general
			console.log("Outcome concept "+outcome_conceptId+" has never been attempted in the past");
			num_non_attempted_concepts= num_non_attempted_concepts + 1;
			non_attempted_concepts.push(outcome_conceptId);
		}
	}

	console.log(num_non_attempted_concepts+" outcome concepts have not been attempted in the past");
	console.log(non_attempted_concepts);

	var resources = Object.keys(topic.activities);

	var example_recommendations = [];
	//If there are concepts that have not been attempted in the past
	if(num_non_attempted_concepts>0){
		var examples_resource_ids = resources.filter(function(d){return d.includes("Example")});
		//console.log(examples_resource_ids);
		for(var i=0;i<examples_resource_ids.length;i++){
			var resource_id = examples_resource_ids[i];
			if(resources.includes(resource_id)){
				var activities = topic.activities[resource_id];
				var n_activities = activities.length;
				for (var k=0;k<n_activities;k++){
					var activity = activities[k];
					var kcs = activity["kcs"];

					//Identify the overlapping concepts between the non attempted concepts (for that specific student) and the kcs of the example activities
					var overlap_non_attempted_outcomes_kcs = kcs.filter(function(n) {
						return non_attempted_concepts.indexOf(n) !== -1;
					});

					console.log("Overlap non-attempted outcome concepts");
					console.log(overlap_non_attempted_outcomes_kcs);
					
					var rec_score = 0;
		
					var act_progress = 0;
					console.log(topic_activities[resource_id][activity.id])
					act_progress = topic_activities[resource_id][activity.id].values.p;
		
					// Only examples that include non-attempted outcome concepts
					// and the non-completed ones will be recommended (progress - p - less than 1) are candidates to be recommended first
					if(overlap_non_attempted_outcomes_kcs.length>0 && act_progress<1){
						//Total number of concepts needed for solving the problem / understanding the example
						var total_kcs = 0;
						var total_prerequisites = 0;
						var total_outcomes = 0;
		
						//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
						var prerequisites_mastery = 0;
						var weight_prerequisites = 0;
		
						//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
						var outcomes_lack_mastery = 0;
						var weight_outcomes = 0;
		
						for (var l=0;l<kcs.length;l++){
							var kc_id = kcs[l];
		
							if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
								//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
								if (set_prerequisites.has(kc_id)){
									var prerequisite_weight = Math.log(1*idf_values[kc_id]);
									prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].uk_total;
									total_kcs = total_kcs + 1
									weight_prerequisites = prerequisite_weight + weight_prerequisites
									total_prerequisites = total_prerequisites + 1;
								}else{
									//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
									if(set_outcomes.has(kc_id)){
										var outcome_weight = Math.log(1*idf_values[kc_id]);
										outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].uk_total);
										total_kcs = total_kcs + 1
										weight_outcomes = outcome_weight + weight_outcomes
										total_outcomes = total_outcomes + 1;
									}
								}
							}
						}		
						if(weight_prerequisites>0){
							rec_score = rec_score + total_prerequisites * prerequisites_mastery/weight_prerequisites;
						}
						if(weight_outcomes>0){
							rec_score = rec_score + total_outcomes * outcomes_lack_mastery/weight_outcomes;
							rec_score=rec_score/2;
							//rec_score=rec_score/total_kcs;
							console.log("Rec score with outcomes: "+rec_score)
						}else{
							rec_score=rec_score/2;
						}
						
						
						//console.log(activity.id)
						//console.log("Rec score: "+rec_score);
						var new_kcs = convertKCNamesToCurrentLanguage(kc_topic_weights.filter(function(d){return d.id==overlap_non_attempted_outcomes_kcs[0];}))
						var rec_explanation = LANGUAGES[state.curr.lang].exampleExpLabel+ " <i>"+new_kcs+"</i>.";

						ranked_activity = Object.assign({}, activity);
						ranked_activity["rec_score"] = rec_score;
						ranked_activity["topic"] = topic_name;
						ranked_activity["explanation"] = rec_explanation;
						example_recommendations.push(ranked_activity);
					}	
				}
				if(example_recommendations.length>0){
					//Sort the array of prioritized example recommendations
					example_recommendations.sort(compareActivities);

					//We get only 2 examples from the candidate examples that cover 
					example_recommendations = example_recommendations.slice(0,2);

					console.log("Array of prioritized example recommendations: ");
					console.log(example_recommendations);
					
				}			
			}
		}
	}

	var n_resources = resources.length;
	for (var j=0; j<n_resources;j++){
		var resource_id = resources[j];
		if (!resource_id.startsWith("Examples") || !resource_id.startsWith("Ejemplos") || (resource_id=="Examples" && example_recommendations.length==0)){
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var rec_score = 0;

				var act_progress = 0;
				console.log(topic_activities[resource_id][activity.id])
				act_progress = topic_activities[resource_id][activity.id].values.p;

				//Only non-completed activities will be recommended (progress - p - less than 1)
				if(act_progress<1){
					//Total number of concepts needed for solving the problem / understanding the example
					var total_kcs = 0;
					var total_prerequisites =0;
					var total_outcomes =0;

					//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
					var prerequisites_mastery = 0;
					var weight_prerequisites = 0;
					var ids_act_prerequisites = new Set();

					//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
					var outcomes_lack_mastery = 0;
					var weight_outcomes = 0;
					var ids_act_outcomes = new Set();

					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];

						if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
							//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
							if (set_prerequisites.has(kc_id)){
								var prerequisite_weight = Math.log(1*idf_values[kc_id]);
								ids_act_prerequisites.add(kc_id);
								prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].uk_total;
								total_kcs = total_kcs + 1
								weight_prerequisites = prerequisite_weight + weight_prerequisites
								total_prerequisites = total_prerequisites + 1;
							}else{
								//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
								if(set_outcomes.has(kc_id)){
									var outcome_weight = Math.log(1*idf_values[kc_id]);
									ids_act_outcomes.add(kc_id);
									outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].uk_total);
									total_kcs = total_kcs + 1
									weight_outcomes = outcome_weight + weight_outcomes
									total_outcomes = total_outcomes + 1;
								}
							}
						}
					}
					if(total_prerequisites>0){
						rec_score = rec_score + prerequisites_mastery/weight_prerequisites;//total_prerequisites * prerequisites_mastery/weight_prerequisites;
					}

					//NEW if there is no outcome that matches then it should have low priority, so we divide the rec score by 2 (only prereqs are important, no outcomes)
					if(total_outcomes>0){
						rec_score = rec_score + outcomes_lack_mastery/weight_outcomes//total_outcomes * outcomes_lack_mastery/weight_outcomes;
						rec_score=rec_score/2;
					}else{
						rec_score=rec_score/2;
					}

					var rec_explanation = LANGUAGES[state.curr.lang].thisActIsRecLabel;
					
					//console.log(activity.id);
					//console.log("Rec score: "+rec_score);

					var top_num_concepts = 3;
					var top_prerequisite_concepts = prerequisite_idfs.filter(function(d){return ids_act_prerequisites.has(d.conceptId);}).slice(0,top_num_concepts);
					var top_outcome_concepts = outcome_idfs.filter(function(d){return ids_act_outcomes.has(d.conceptId);}).slice(0,top_num_concepts);

					//Threshold and definitions for the explanations
					var mastery_concepts = 0;
					var mastery_threshold = .95;
					var proficiency_concepts = 0;
					var proficiency_threshold = .75;
					var good_concepts = 0;
					var good_threshold = .6;
					var ok_concepts = 0;

					var avg_k_prerequisite_concepts = 0;
					var total_weight_prerequisites = 0;
					for(var i=0;i<top_prerequisite_concepts.length;i++){
						var k_concept = kc_levels[top_prerequisite_concepts[i].conceptId].uk_total;
						var weight_concept = Math.log(1*idf_values[top_prerequisite_concepts[i].conceptId]);
						if(k_concept>=mastery_threshold){
							mastery_concepts++;
						}else{
							if(k_concept>=proficiency_threshold){
								proficiency_concepts++;
							}else{
								if(k_concept>=good_threshold){
									good_concepts++;
								}else{
									ok_concepts++;
								}
							}
						}
						avg_k_prerequisite_concepts = avg_k_prerequisite_concepts + weight_concept*k_concept;
						total_weight_prerequisites = total_weight_prerequisites + weight_concept;
					}
					

					avg_k_prerequisite_concepts = avg_k_prerequisite_concepts/total_weight_prerequisites;
					if(top_prerequisite_concepts.length<top_num_concepts) top_num_concepts=top_prerequisite_concepts.length;

					console.log("avg prerequisites")
					console.log(avg_k_prerequisite_concepts)

					var prerequisite_explanation = "";

					if(top_prerequisite_concepts && top_prerequisite_concepts.length>0){
						//console.log("Average most important prerequisites:");
						//console.log(avg_k_prerequisite_concepts);
						if(avg_k_prerequisite_concepts>=mastery_threshold){
							prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel1;
						}else{
							if(avg_k_prerequisite_concepts>=proficiency_threshold){
								prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel2;
							}else{
								if(avg_k_prerequisite_concepts>=good_threshold){
									prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel3;
								}else{
									prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel4;
								}
							}
						}
					}
					console.log(prerequisite_explanation)
					var excellent_opportunity_threshold =.8;
					var good_opportunity_threshold =.6;
					var fair_opportunity_threshold = .4; 

					var avg_k_outcome_concepts = 0;
					var total_weight_outcomes = 0;
					for(var i=0;i<top_outcome_concepts.length;i++){
						var k_concept = 1- kc_levels[top_outcome_concepts[i].conceptId].uk_total;
						var weight_concept = Math.log(1*idf_values[top_outcome_concepts[i].conceptId]);
						avg_k_outcome_concepts = avg_k_outcome_concepts + weight_concept*k_concept;
						total_weight_outcomes = total_weight_outcomes + weight_concept;
					}
					

					avg_k_outcome_concepts = avg_k_outcome_concepts/total_weight_outcomes;

					console.log("avg outcomes")
					console.log(avg_k_outcome_concepts)

					if(top_outcome_concepts.length<top_num_concepts) top_num_concepts=top_outcome_concepts.length;

					var outcome_explanation = "";

					if(top_outcome_concepts && top_outcome_concepts.length>0){
						//console.log("Average learning opportunity of most important outcomes:");
						//console.log(avg_k_outcome_concepts);
						if(avg_k_outcome_concepts>=excellent_opportunity_threshold){
							outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel1;
						}else{
							if(avg_k_outcome_concepts>=good_opportunity_threshold){
								outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel2;
							}else{
								if(avg_k_outcome_concepts>=fair_opportunity_threshold){
									outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel3;
								}else{
									outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel4;
								}
							}
						}
					}
					console.log(outcome_explanation)
	
					rec_explanation = rec_explanation + prerequisite_explanation;
					rec_explanation = rec_explanation + outcome_explanation;
					rec_explanation = rec_explanation + "</ul>";

					// var avg_k_top_outcomes = 0;
					// for(var i=0;i<top_outcome_concepts.length;i++){
					// 	var 
					// }

					

					//Commented by @Jordan from here
					// if ((problematic_kcs+slip_kcs)>0){
					// 	rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concepts which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past.</li>"
					// 	//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
					// 	// Peter suggested to hide this part of the explanation
					// 	// if (slip_kcs){
					// 	// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
					// 	// }
					// 	//rec_explanation = rec_explanation + "<br>";
					// }
					// if (helpful_kcs>0){
					// 	rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs+"</b> concepts out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
					// 	var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 ;
					// 	var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
					// 	if(is_sqlknot){
					// 		rec_explanation = rec_explanation + " solve this problem.</li>";
					// 	}else{
					// 		if(is_example){
					// 			rec_explanation = rec_explanation + " understand this example.</li>";
					// 		}
					// 	}	
					// }
					// //Generate recommendations only if they have failed in the lastk attempts
					// if((problematic_kcs+slip_kcs)>0){
					// 	condition_to_generate_recommendations = true;
					// 	rec_explanation = rec_explanation + "</ul>";

					ranked_activity = Object.assign({}, activity);
					ranked_activity["rec_score"] = rec_score;
					ranked_activity["topic_name"] = topic_name;
					ranked_activity["explanation"] = rec_explanation;
					recommendations.push(ranked_activity);
					// }
					//end of Jordan's comment
				}	
			}
		}
	}
	//}
	if(recommendations.length>0){
		recommendations.sort(compareActivities);
	}
	//Delete the activities from the topics that were decided to not to be recommended
	//recommendations = recommendations.filter(function(d){return !non_recommended_topics.includes(d.topic);});
	// if(!condition_to_generate_recommendations){
	// 	recommendations = [];
	// }
	var merged_recommendations = example_recommendations.concat(recommendations);
	//
	var merged_recommendations_without_duplicates = merged_recommendations.filter(function (a) {
        return !this[a.id] && (this[a.id] = true);
    }, Object.create(null));

	console.log("Recommendations to keep you up with the class")
	console.log(merged_recommendations_without_duplicates)
	//return merged_recommendations;
	return merged_recommendations_without_duplicates;
}


// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Knowledge Maximization (km) 
 * Generate a list of recommended content list based on the balance between the knowledge of
 * prerequisite and outcome concepts
 */
function generateKMRecommendations(topics_concepts, topic, topics_activities, kc_levels, kc_topic_weights, weight_kcs){
	//Define the outcome and prerequisites for the current topic
	var topicOrder = -1;
	//var topic_name = topic.name;
	var topic_name = topic.id;

	var topicInfo = topics_concepts.filter(function(d){
		return d.topicId == topic_name;
	});

	if (topicInfo && topicInfo.length>0){
		topicOrder = topicInfo[0].topicOrder;
	}
	var topic_activities = topics_activities[topic_name];

	var prerequisites = [];
	prerequisites = topics_concepts.filter(function(d){return d.topicOrder < topicOrder});
	for(var i=0; i<prerequisites.length;i++){
		var prerequisite_concept = prerequisites[i];
		kc_levels[prerequisite_concept.conceptId].type = "prerequisite";
	}
	set_prerequisites = new Set(prerequisites.map(function(d){ return d.conceptId}));
	console.log("Set of prerequisites:");
	console.log(set_prerequisites);

	var outcomes =[]
	outcomes = topics_concepts.filter(function(d){return d.topicOrder == topicOrder});
	for(var i=0; i<outcomes.length;i++){
		var outcome_concept = outcomes[i]
		kc_levels[outcome_concept.conceptId].type = "outcome";
	}
	set_outcomes = new Set(outcomes.map(function(d){ return d.conceptId}));
	console.log("Set of outcomes:");
	console.log(set_outcomes);

	// Calculate the weights for outcomes and prerequisite concepts using TF-IDF (boolean in this case as we do not have number of times that concept appears in an activity)
	// starting from idf values
	var idf_values = {};
	var prerequisite_idfs = [];
	var outcome_idfs = [];
	var total_acts_prev_topics = topics_concepts.filter(function(d){return d.topicOrder<=topicOrder;}).map(function(d){return d.topicActs;}).reduce(function(a, b) { return a + b; });
	for(var i=0;i<prerequisites.length;i++){
		var prerequisite = prerequisites[i];
		var prerequisite_id = prerequisite.conceptId;
		prerequisites[i].k=kc_levels[prerequisite_id].k;
		var prerequisite_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==prerequisite_id)});
		var num_acts_prerequisite = prerequisite_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_prerequisite);
	}

	for(var i=0;i<prerequisites.length;i++){
		var prerequisite = prerequisites[i];
		var prerequisite_id = prerequisite.conceptId;
		var prerequisite_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==prerequisite_id)});
		var num_acts_prerequisite = prerequisite_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_prerequisite);
		idf_values[prerequisite_id] = idf_concept;
		prerequisite_idfs.push({'conceptId': prerequisite_id, 'value': idf_concept});
	}

	for(var i=0;i<outcomes.length;i++){
		var outcome = outcomes[i];
		var outcome_id = outcome.conceptId;
		outcomes[i].k = kc_levels[outcome_id].k;
		var outcome_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==outcome_id)});
		var num_acts_outcome = outcome_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_outcome);
		idf_values[outcome_id] = idf_concept;
		outcome_idfs.push({'conceptId': outcome_id, 'value': idf_concept});
	}

	//Sort idf values for generating explanations for km recommendations
	prerequisite_idfs.sort(function(a,b){return b.value-a.value;});
	outcome_idfs.sort(function(a,b){return b.value-a.value;});

	console.log("Prerequisite idf values:");
	console.log(prerequisite_idfs);
	console.log("Outcome idf values:");
	console.log(outcome_idfs)

	var recommendations = [];
	//var topics = data_topics_acts_kcs;
	//var n_topics = topics.length;

	//If at least one of the kcs have a level > .5, we generate the recommendations
	//var condition_to_generate_recommendations = false;

	// for(var i=1; i<n_topics;i++){
	// var topic = topics[i];
	// var topic_name = topic.name;

	//First we see if there are never attempted outcome concepts
	var num_non_attempted_concepts = 0;
	var non_attempted_concepts = [];
	for(var i=0;i<outcomes.length;i++){
		var outcome_conceptId = outcomes[i].conceptId;
		var outcome_concept_k = kc_levels[outcome_conceptId].k;
		//Here we check if a concept has been attempted in a previous activity 
		if((data.configprops.agg_kc_student_modeling=="bn" && outcome_concept_k==.5) || (data.configprops.agg_kc_student_modeling=="cumulate" && outcome_concept_k==0)){//TODO: we should check the real number of attempts instead the kc level given by bn_general
			num_non_attempted_concepts= num_non_attempted_concepts + 1;
			non_attempted_concepts.push(outcome_conceptId);
		}
	}

	console.log(num_non_attempted_concepts+" outcome concepts have not been attempted in the past");
	console.log(non_attempted_concepts);

	var resources = Object.keys(topic.activities);

	var example_recommendations = [];
	//If there are concepts that have not been attempted in the past
	if(num_non_attempted_concepts>0){
		var examples_resource_ids = resources.filter(function(d){return d.includes("Example")});
		//console.log(examples_resource_ids);
		for(var i=0;i<examples_resource_ids.length;i++){
			var resource_id = examples_resource_ids[i];
			if(resources.includes(resource_id)){
				var activities = topic.activities[resource_id];
				var n_activities = activities.length;
				for (var k=0;k<n_activities;k++){
					var activity = activities[k];
					var kcs = activity["kcs"];

					//Identify the overlapping concepts between the non attempted concepts (for that specific student) and the kcs of the example activities
					var overlap_non_attempted_outcomes_kcs = kcs.filter(function(n) {
						return non_attempted_concepts.indexOf(n) !== -1;
					});

					console.log("Overlap non-attempted outcome concepts");
					console.log(overlap_non_attempted_outcomes_kcs);
					
					var rec_score = 0;
		
					var act_progress = 0;
					console.log(topic_activities[resource_id][activity.id])
					act_progress = topic_activities[resource_id][activity.id].values.p;
		
					// Only examples that include non-attempted outcome concepts
					// and the non-completed ones will be recommended (progress - p - less than 1) are candidates to be recommended first
					if(overlap_non_attempted_outcomes_kcs.length>0 && act_progress<1){
						//Total number of concepts needed for solving the problem / understanding the example
						var total_kcs = 0;
						var total_prerequisites = 0;
						var total_outcomes = 0;
		
						//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
						var prerequisites_mastery = 0;
						var weight_prerequisites = 0;
		
						//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
						var outcomes_lack_mastery = 0;
						var weight_outcomes = 0;
		
						for (var l=0;l<kcs.length;l++){
							var kc_id = kcs[l];
		
							if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
								//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
								if (set_prerequisites.has(kc_id)){
									var prerequisite_weight = Math.log(1*idf_values[kc_id]);
									prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].k;
									total_kcs = total_kcs + 1
									weight_prerequisites = prerequisite_weight + weight_prerequisites
									total_prerequisites = total_prerequisites + 1;
								}else{
									//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
									if(set_outcomes.has(kc_id)){
										var outcome_weight = Math.log(1*idf_values[kc_id]);
										outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].k);
										total_kcs = total_kcs + 1
										weight_outcomes = outcome_weight + weight_outcomes
										total_outcomes = total_outcomes + 1;
									}
								}
							}
						}		
						if(weight_prerequisites>0){
							rec_score = rec_score + total_prerequisites * prerequisites_mastery/weight_prerequisites;
						}
						if(weight_outcomes>0){
							rec_score = rec_score + total_outcomes * outcomes_lack_mastery/weight_outcomes;
						}
						rec_score=rec_score/total_kcs;
						
						//console.log(activity.id)
						//console.log("Rec score: "+rec_score);

						var rec_explanation = LANGUAGES[state.curr.lang].exampleExpLabel + " <i>"+kc_topic_weights.filter(function(d){return d.id==overlap_non_attempted_outcomes_kcs[0];})[0].dn+"</i>).";

						ranked_activity = Object.assign({}, activity);
						ranked_activity["rec_score"] = rec_score;
						ranked_activity["topic"] = topic_name;
						ranked_activity["explanation"] = rec_explanation;
						example_recommendations.push(ranked_activity);
					}	
				}
				if(example_recommendations.length>0){
					//Sort the array of prioritized example recommendations
					example_recommendations.sort(compareActivities);

					//We get only 2 examples from the candidate examples that cover 
					example_recommendations = example_recommendations.slice(0,2);

					console.log("Array of prioritized example recommendations: ");
					console.log(example_recommendations);
					
				}			
			}
		}
	}

	var n_resources = resources.length;
	for (var j=0; j<n_resources;j++){
		var resource_id = resources[j];
		if (resource_id != "Examples" || (resource_id=="Examples" && example_recommendations.length==0)){
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var rec_score = 0;

				var act_progress = 0;
				console.log(topic_activities[resource_id][activity.id])
				act_progress = topic_activities[resource_id][activity.id].values.p;

				//Only non-completed activities will be recommended (progress - p - less than 1)
				if(act_progress<1){
					//Total number of concepts needed for solving the problem / understanding the example
					var total_kcs = 0;
					var total_prerequisites =0;
					var total_outcomes =0;

					//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
					var prerequisites_mastery = 0;
					var weight_prerequisites = 0;
					var ids_act_prerequisites = new Set();

					//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
					var outcomes_lack_mastery = 0;
					var weight_outcomes = 0;
					var ids_act_outcomes = new Set();

					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];

						if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
							//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
							if (set_prerequisites.has(kc_id)){
								var prerequisite_weight = Math.log(1*idf_values[kc_id]);
								ids_act_prerequisites.add(kc_id);
								prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].k;
								total_kcs = total_kcs + 1
								weight_prerequisites = prerequisite_weight + weight_prerequisites
								total_prerequisites = total_prerequisites + 1;
							}else{
								//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
								if(set_outcomes.has(kc_id)){
									var outcome_weight = Math.log(1*idf_values[kc_id]);
									ids_act_outcomes.add(kc_id);
									outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].k);
									total_kcs = total_kcs + 1
									weight_outcomes = outcome_weight + weight_outcomes
									total_outcomes = total_outcomes + 1;
								}
							}
						}
					}
					if(total_prerequisites>0){
						rec_score = rec_score + total_prerequisites * prerequisites_mastery/weight_prerequisites;
					}
					if(total_outcomes>0){
						rec_score = rec_score + total_outcomes * outcomes_lack_mastery/weight_outcomes;
					}
					rec_score=rec_score/(total_prerequisites + total_outcomes);

					var rec_explanation = "This activity is recommended because:<ul>";
					
					//console.log(activity.id);
					//console.log("Rec score: "+rec_score);

					var top_num_concepts = 3;
					var top_prerequisite_concepts = prerequisite_idfs.filter(function(d){return ids_act_prerequisites.has(d.conceptId);}).slice(0,top_num_concepts);
					var top_outcome_concepts = outcome_idfs.filter(function(d){return ids_act_outcomes.has(d.conceptId);}).slice(0,top_num_concepts);


					var avg_k_prerequisite_concepts = 0;
					var total_weight_prerequisites = 0;
					for(var i=0;i<top_prerequisite_concepts.length;i++){
						var k_concept = kc_levels[top_prerequisite_concepts[i].conceptId].k;
						var weight_concept = Math.log(1*idf_values[top_prerequisite_concepts[i].conceptId]);
						if(k_concept>=mastery_threshold){
							mastery_concepts++;
						}else{
							if(k_concept>=proficiency_threshold){
								proficiency_concepts++;
							}else{
								if(k_concept>=good_threshold){
									good_concepts++;
								}else{
									ok_concepts++;
								}
							}
						}
						avg_k_prerequisite_concepts = avg_k_prerequisite_concepts + weight_concept*k_concept;
						total_weight_prerequisites = total_weight_prerequisites + weight_concept;
					}

					avg_k_prerequisite_concepts = avg_k_prerequisite_concepts/total_weight_prerequisites;
					if(top_prerequisite_concepts.length<top_num_concepts) top_num_concepts=top_prerequisite_concepts.length;

					var prerequisite_explanation = "";

					if(top_prerequisite_concepts && top_prerequisite_concepts.length>0){
						//console.log("Average most important prerequisites:");
						//console.log(avg_k_prerequisite_concepts);
						if(avg_k_prerequisite_concepts>=mastery_threshold){
							prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel1
						}else{
							if(avg_k_prerequisite_concepts>=proficiency_threshold){
								prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel2
							}else{
								if(avg_k_prerequisite_concepts>=good_threshold){
									prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel3
								}else{
									prerequisite_explanation+=LANGUAGES[state.curr.lang].prereqExpLabel4
								}
							}
						}
					}
					var excellent_opportunity_threshold =.8;
					var good_opportunity_threshold =.6;
					var fair_opportunity_threshold = .4; 

					var avg_k_outcome_concepts = 0;
					var total_weight_outcomes = 0;
					for(var i=0;i<top_outcome_concepts.length;i++){
						var k_concept = 1- kc_levels[top_outcome_concepts[i].conceptId].k;
						var weight_concept = Math.log(1*idf_values[top_outcome_concepts[i].conceptId]);
						avg_k_outcome_concepts = avg_k_outcome_concepts + weight_concept*k_concept;
						total_weight_outcomes = total_weight_outcomes + weight_concept;
					}

					avg_k_outcome_concepts = avg_k_outcome_concepts/total_weight_outcomes;
					if(top_outcome_concepts.length<top_num_concepts) top_num_concepts=top_outcome_concepts.length;

					var outcome_explanation = "";
					
					if(top_outcome_concepts && top_outcome_concepts.length>0){
						//console.log("Average learning opportunity of most important outcomes:");
						//console.log(avg_k_outcome_concepts);
						if(avg_k_outcome_concepts>=excellent_opportunity_threshold){
							outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel1;
							if(avg_k_outcome_concepts>=good_opportunity_threshold){
								outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel2;
							}else{
								if(avg_k_outcome_concepts>=fair_opportunity_threshold){
									outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel3;
								}else{
									outcome_explanation+=LANGUAGES[state.curr.lang].outcomeExpLabel4;
								}
							}
						}
					}
	
					rec_explanation = rec_explanation + prerequisite_explanation;
					rec_explanation = rec_explanation + outcome_explanation;
					rec_explanation = rec_explanation + "</ul>";

					// var avg_k_top_outcomes = 0;
					// for(var i=0;i<top_outcome_concepts.length;i++){
					// 	var 
					// }

					

					//Commented by @Jordan from here
					// if ((problematic_kcs+slip_kcs)>0){
					// 	rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concepts which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past.</li>"
					// 	//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
					// 	// Peter suggested to hide this part of the explanation
					// 	// if (slip_kcs){
					// 	// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
					// 	// }
					// 	//rec_explanation = rec_explanation + "<br>";
					// }
					// if (helpful_kcs>0){
					// 	rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs+"</b> concepts out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
					// 	var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 ;
					// 	var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
					// 	if(is_sqlknot){
					// 		rec_explanation = rec_explanation + " solve this problem.</li>";
					// 	}else{
					// 		if(is_example){
					// 			rec_explanation = rec_explanation + " understand this example.</li>";
					// 		}
					// 	}	
					// }
					// //Generate recommendations only if they have failed in the lastk attempts
					// if((problematic_kcs+slip_kcs)>0){
					// 	condition_to_generate_recommendations = true;
					// 	rec_explanation = rec_explanation + "</ul>";

					ranked_activity = Object.assign({}, activity);
					ranked_activity["rec_score"] = rec_score;
					ranked_activity["topic"] = topic_name;
					ranked_activity["explanation"] = rec_explanation;
					recommendations.push(ranked_activity);
					// }
					//end of Jordan's comment
				}	
			}
		}
	}
	//}
	if(recommendations.length>0){
		recommendations.sort(compareActivities);
	}
	//Delete the activities from the topics that were decided to not to be recommended
	//recommendations = recommendations.filter(function(d){return !non_recommended_topics.includes(d.topic);});
	// if(!condition_to_generate_recommendations){
	// 	recommendations = [];
	// }
	var merged_recommendations = example_recommendations.concat(recommendations);
	//
	var merged_recommendations_without_duplicates = merged_recommendations.filter(function (a) {
        return !this[a.id] && (this[a.id] = true);
    }, Object.create(null));

	//return merged_recommendations;
	return merged_recommendations_without_duplicates;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Sort the activity objects according to their recommendation score
 */
function compareActivities(a,b) {
  if (a.rec_score > b.rec_score)
    return -1;
  if (a.rec_score < b.rec_score)
    return 1;
  return 0;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Sort the activity objects according to their recommendation score
 */
function calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr) {
  var user_index = data.learners.indexOf(data.learners.filter(function(d){return d.id==state.curr.usr})[0]);
  var kcs_ids = Object.keys(kc_levels);
  console.log("Calculate KC difficulty scores...");
  for(var i=0;i<kcs_ids.length;i++){
  	var kc_id = kcs_ids[i];
	//here we have to use total_uk instead of uk because we want to consider the students input
  	
	var kc_level_original = kc_levels[kc_id]["uk"];
	var kc_has_edits = kc_levels[kc_id]["hasEdition"];
	var kc_edition = kc_levels[kc_id]["edition"];
  	var lastk_sr = kc_levels[kc_id]["lastk-sr"];
  	var overall_sr = kc_levels[kc_id]["sr"];
	var kc_level = kc_level_original + (kc_has_edits ? editImpactValues.get(kc_edition):0)
	if(kc_level<0) kc_level = 0
	if(kc_level>1) kc_level = 1
	kc_levels[kc_id]["uk_total"] = kc_level
	var attempts = kc_levels[kc_id]["a"];
  	var kc_difficulty_score = NaN;
	//console.log("KC: "+kc_id+" -> calculating diff score...");
	//console.log(kc_levels[kc_id])
  	if(lastk_sr>0){
  		kc_difficulty_score = 1 - (lastk_sr*weight_sr + kc_level*weight_kcs);
		if(kc_edition<0){
			kc_difficulty_score = Math.min(kc_difficulty_score+0.1,1);
			kc_levels[kc_id]["studentSpecifiedProblem"] = true;
		}
  	}else{
  		if(attempts>0){
  			kc_difficulty_score = 1 - (overall_sr*weight_sr + kc_level*weight_kcs);
			if(kc_edition<0){
				kc_difficulty_score = Math.min(kc_difficulty_score+0.1,1);
				kc_levels[kc_id]["studentSpecifiedProblem"] = true;
			}
  		}else{
			if(attempts==0 && kc_level==0 && kc_has_edits && kc_edition<0){
				//if the user edited negatively till a point that it reaches zero, it could be inferred that the 
				//user is having troubles with it
				kc_difficulty_score = 0.75;
				kc_levels[kc_id]["studentSpecifiedProblem"] = true;
			}
		}
  	}
  	kc_levels[kc_id]["diff"]=kc_difficulty_score;
  }
  console.log("kc diff scores:");
  console.log(kc_levels);
  //update difficulty in data.learners.state.kcs
  var user_index = data.learners.indexOf(data.learners.filter(function(d){return d.id==state.curr.usr})[0]);

  //Update the kc difficulty values in data.learners.state.kcs
  for (let kc_index in kc_levels) {
		var kc = kc_levels[kc_index]; 
		var kc_id = kc.id;
		if (kc_id in data.learners[user_index].state.kcs) {
			data.learners[user_index].state.kcs[kc_id].diff = kc.diff;
		}
   }
}

// function addRecommendationsToUI(){
// 	//console.log("Add recommendation to UI...");
// 	//console.log(top_recommended_activities);

// 	//Remove existing stars
// 	d3.selectAll(".recommendationStar").remove();
// 	d3.selectAll(".recommended_act").classed("recommended_act",false);

// 	console.log("top recommended activities")
// 	console.log(top_recommended_activities)

// 	if(data.configprops.agg_proactiverec_method=="km" || data.configprops.agg_proactiverec_method=="remedial" || state.args.learningGoal!=undefined){
// 		if(top_recommended_activities && top_recommended_activities.length > 0) {
			
// 			//var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().name)
// 			var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().id)
			
// 			if(topic_rec_activities.length > 0) {

// 				//console.log("Rank recommended activities:");
// 				//console.log(rank_recommended_activities);

// 				d3.selectAll("g.grid-cell-outter").each( function(d, i){
// 					var current_topic = data.topics[d.topicIdx]
// 					var mg_activities = current_topic ? current_topic.activities:undefined;
// 					var data_resource = data.resources[d.resIdx]
// 					var data_resource_id = data_resource ? data_resource.id:undefined;
// 					var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
// 					var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
// 					//var mg_activity = data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]
// 					if(mg_activity) {
// 						var act_id = mg_activity.id
// 						var act_name = d.actName;
// 						var act_is_recommended = (act_id in rank_recommended_activities);
// 						mg_activity['actIdx'] = d.actIdx
// 						mg_activity['topicIdx'] = d.topicIdx
// 						mg_activity['resIdx'] = d.resIdx

// 						if(act_is_recommended){

// 							//This is to fix the globally stored top_recommended_activities array. (To solve the problem of first topic openning)
// 							let recommended_activity = top_recommended_activities.find(x => x.id === mg_activity.id)
// 							recommended_activity['actIdx'] = d.actIdx
// 							recommended_activity['topicIdx'] = d.topicIdx
// 							recommended_activity['resIdx'] = d.resIdx

// 							d3.select(this).classed("recommended_act", true);
// 							// d3.select(this).append("svg:image")
// 							// .attr('x', 8)
// 							// .attr('y', 2)
// 							// .attr('width', scaleRecommendationStar(rank_recommended_activities[act_id]))
// 							// .attr('height', scaleRecommendationStar(rank_recommended_activities[act_id]))
// 							// .attr("class","recommendationStar")
// 							// .attr("xlink:href", function(d){
// 							// 	return "./img/star.png";
// 							// })
// 							// .style("pointer-events","none");
// 							var rank_rec = rank_recommended_activities[act_id];
// 							var map_rank_to_seq = -1;

// 							//TODO write here what happen if the proactive method is km
// 							if(data.configprops.agg_proactiverec_method=="km"){
// 								if(rank_rec===0){
// 									map_rank_to_seq = 1;
// 								}else{
// 									if(rank_rec===1){
// 										map_rank_to_seq = 0.7;
// 									}else{
// 										if(rank_rec===2){
// 											map_rank_to_seq = 0.3;
// 										}else{

// 											map_rank_to_seq = 0.0;	

// 										}
// 									}
// 								}
// 							}
// 							//TODO write here what happen if the proactive method is remedial
// 							if(data.configprops.agg_proactiverec_method=="remedial"){
// 								// function for adding two numbers.
// 								const add = (a, b) => a + b
// 								// use reduce to sum the total number of recommended activities
// 								//var total_rec_activities = Object.values(map_topic_max_rank_rec_act).reduce(add);
								
// 								//We use the total number of recommendations shown that is coming from vis.js in MG through the array top_recommended_activities
// 								var total_rec_activities = top_recommended_activities.length;
// 								map_rank_to_seq = 1-(rank_rec/total_rec_activities);
// 							}
							
							
// 							d3.select(this)
// 								.append("svg:polygon")
// 								//.attr("id", "star_1")
// 								.attr("visibility", "visible")
// 								//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
// 								.attr("points", function (d) { d.seq = map_rank_to_seq; return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
// 								.attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
// 								//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
// 								.attr("stroke", "white")
// 								.attr("max_rec_rank_act",rank_recommended_activities[act_id])
// 								.attr("class","act_topic")
// 								.style("shape-rendering", "geometricPrecision")
// 								.style("pointer-events","none");
							
// 							d3.select(this)
// 								.append("text").
// 								attr("x", 15).
// 								attr("y", 15).
// 								attr("class", "rec_act_rank_txt").
// 								style("text-anchor", "start").
// 								text(function (d) {
// 									if(data.configprops.agg_proactiverec_method=="km"){
// 										if(d.seq === 1) {
// 											return " 1";
// 										} else if (d.seq === 0.7) {
// 											return " 2";
// 										} else if (d.seq === 0.3){
// 											return " 3";
// 										} else{
// 											return "";
// 										}
// 									}
// 									if(data.configprops.agg_proactiverec_method=="remedial"){
// 										return rank_rec+1;
// 									}
									
								
// 								/*if(d.seq === 1) {
// 									return "+6";
// 								} else if (d.seq === 0.7) {
// 									return "+4";
// 								} else {
// 									return "+2";
// 								}*/
// 								})
// 								.attr("font-family", "sans-serif")
// 										.attr("font-size", "12px")
// 								.attr("style", function(d) {
// 									var colorIndex = Math.round(data.vis.color.value2color(d.val)*10);
// 									var color = colorbrewer.Oranges[9][8-Math.min(colorIndex,8)];
// 									return "fill: " + color + ";"; 
// 								})
// 								.style("pointer-events","none");
// 						};
// 					}
					
// 				});
// 			}
// 		}
// 	}else{
// 		d3.selectAll("g.grid-cell-outter").each( function(d, i){
// 					var current_topic = data.topics[d.topicIdx]
// 					var mg_activities = current_topic ? current_topic.activities:undefined;
// 					var data_resource = data.resources[d.resIdx]
// 					var data_resource_id = data_resource ? data_resource.id:undefined;
// 					var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
// 					var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
// 					//var mg_activity = data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]
// 					if(mg_activity) {
// 						//var act_id = mg_activity.id
// 						//var act_name = d.actName;
// 						var act_is_recommended = d.seq>0 ? true : false;
// 						//var act_is_recommended = (act_id in rank_recommended_activities);
// 						//mg_activity['actIdx'] = d.actIdx
// 						//mg_activity['topicIdx'] = d.topicIdx
// 						//mg_activity['resIdx'] = d.resIdx
		
// 							d3.select(this)
// 								.append("svg:polygon")
// 								//.attr("id", "star_1")
// 								.attr("visibility", "visible")
// 								//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
// 								.attr("points", function (d) { return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
// 								.attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
// 								//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
// 								.attr("stroke", "white")
// 								//.attr("max_rec_rank_act",rank_recommended_activities[act_id])
// 								.attr("class","act_topic")
// 								.style("shape-rendering", "geometricPrecision")
// 								.style("pointer-events","none");
							
// 							d3.select(this)
// 								.append("text").
// 								attr("x", 15).
// 								attr("y", 15).
// 								attr("class", "rec_act_rank_txt").
// 								style("text-anchor", "start").
// 								text(function (d) {
// 									if(d.seq === 1) {
// 										return "1";
// 									} else if (d.seq === 0.7) {
// 										return "2";
// 									} else if(d.seq ===0.3){
// 										return "3";
// 									}else{
// 										return "";
// 									}
// 								})
// 								.attr("font-family", "sans-serif")
// 										.attr("font-size", "12px")
// 								.attr("style", function(d) {
// 									var colorIndex = Math.round(data.vis.color.value2color(d.val)*10);
// 									var color = colorbrewer.Oranges[9][8-Math.min(colorIndex,8)];
// 									return "fill: " + color + ";"; 
// 								})
// 								.style("pointer-events","none");
// 						//};
// 					}
					
// 				});
// 	}    
// }

// function generateProactiveRecommendations(method){
// 	if(method=="km"){
// 		console.log("Generate KM recommendations....");

// 		var topic = getTopic();

// 		if (topic==null) return;

// 		var usr_index=data.learners.indexOf(data.learners.filter(function(d){return d.id==state.curr.usr})[0]);
// 		recommended_activities = generateKMRecommendations(topics_concepts, topic, data.learners[usr_index].state.activities, data.learners[usr_index].state.kcs, data.kcs, 0.5);
	
// 		top_recommended_activities = recommended_activities.slice(0,3);
// 		rank_recommended_activities = {};
	
// 		console.log("Top recommended activities:");
// 		console.log(top_recommended_activities);
			
// 		//Here we get the maximum rank of the items recommended per topic
// 		for(var i=0;i<top_recommended_activities.length;i++){
// 		  var rec_act_topic = top_recommended_activities[i]["topic"];
// 		  var rec_act_name  = top_recommended_activities[i]["name"];
// 		  var rec_act_id  = top_recommended_activities[i]["id"];
// 		  if (!(rec_act_topic in map_topic_max_rank_rec_act)){
// 			map_topic_max_rank_rec_act[rec_act_topic] = i;
// 		  }
// 		  rank_recommended_activities[rec_act_id] = i;
// 		}
	
// 		//Post array of recommended activities to the server (http://pawscomp2.sis.pitt.edu/recommendations/LogRecommendations)
// 		if(recommended_activities.length>0){
// 			//Prepare the array of recommendations for storing it in ent_recommendation db in the server (rec schema)
// 			for(var j=0;j<recommended_activities.length;j++){
// 			  var rec_act_id  = recommended_activities[j]["id"];
// 			  if (rec_act_id in rank_recommended_activities){
// 				recommended_activities[j]["isRecommended"]="1";
// 			  }else{
// 				recommended_activities[j]["isRecommended"]="0";
// 			  }
// 			}
// 			//console.log(recommended_activities);
// 			var millisecondsDate = (new Date).getTime();
// 			$.ajax({
// 			  type: "POST",
// 			  data :JSON.stringify({"usr":state.curr.usr,
// 			  "grp":state.curr.grp,
// 			  "sid":state.curr.sid,
// 			  "cid":state.curr.cid,
// 			  "sid":state.curr.sid,
// 			  "logRecId":millisecondsDate.toString(),
// 			  "recMethod":"bn-KM",
// 			  "recommendations":recommended_activities}),
// 			  url: "http://" + CONST.hostName + "/recommendation/LogRecommendations",
// 			  contentType: "application/json"
// 			});
// 		}
// 	  }
// }

function addRecommendationsToUI(){
	//console.log("Add recommendation to UI...");
	//console.log(top_recommended_activities);

	//Remove existing stars
	//from activities
	d3.selectAll(".recommendationStar").remove();
	d3.selectAll(".recommended_act").classed("recommended_act",false);
	//from topics
	d3.selectAll(".rec_topic").remove()


	console.log("Add top recommended activities to the interface")
	console.log(top_recommended_activities)

	// console.log("Rank recommended activities:");
	// console.log(rank_recommended_activities);

	if(data.configprops.agg_proactiverec_method=="km" || data.configprops.agg_proactiverec_method=="remedial" || state.args.learningGoal!=undefined){
		if(top_recommended_activities && top_recommended_activities.length > 0) {
			
			//var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().name)
			//var topic_rec_activities = top_recommended_activities//.filter(activity => activity.topic == getTopic().id)
			
			if(top_recommended_activities.length > 0) {

				//console.log("Rank recommended activities:");
				//console.log(rank_recommended_activities);

				d3.selectAll("g.grid-cell-outter").each( function(d, i){
					var current_topic = data.topics[d.topicIdx]
					var mg_activities = current_topic ? current_topic.activities:undefined;
					var data_resource = data.resources[d.resIdx]
					var data_resource_id = data_resource ? data_resource.id:undefined;
					var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
					var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
					// console.log(current_topic)
					// console.log(mg_activities)
					// console.log(d.resIdx)
					// console.log(data_resource)
					// console.log(d.actIdx)
					//var mg_activity = data_resource ? data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]:undefined
					console.log(mg_activities)
					console.log(mg_activity)
					if(mg_activity) {
						console.log("mg_activity")
						var act_id = mg_activity.id
						var act_name = d.actName;
						var act_is_recommended = (act_id in rank_recommended_activities);
						mg_activity['actIdx'] = d.actIdx
						mg_activity['topicIdx'] = d.topicIdx
						mg_activity['resIdx'] = d.resIdx

						if(act_is_recommended){
							console.log(d);
							//This is to fix the globally stored top_recommended_activities array. (To solve the problem of first topic openning)
							let recommended_activity = top_recommended_activities.find(x => x.id === mg_activity.id )
							console.log(recommended_activity)
							recommended_activity['actIdx'] = d.actIdx
							recommended_activity['topicIdx'] = d.topicIdx
							recommended_activity['resIdx'] = d.resIdx

							d3.select(this).classed("recommended_act", true);
							// d3.select(this).append("svg:image")
							// .attr('x', 8)
							// .attr('y', 2)
							// .attr('width', scaleRecommendationStar(rank_recommended_activities[act_id]))
							// .attr('height', scaleRecommendationStar(rank_recommended_activities[act_id]))
							// .attr("class","recommendationStar")
							// .attr("xlink:href", function(d){
							// 	return "./img/star.png";
							// })
							// .style("pointer-events","none");
							var rank_rec = rank_recommended_activities[act_id];
							d.rank_rec = rank_rec
							var map_rank_to_seq = -1;
							//TODO write here what happen if the proactive method is remedial
							if(data.configprops.agg_proactiverec_method=="remedial" || state.args.learningGoal!=undefined){
								// function for adding two numbers.
								//const add = (a, b) => a + b
								// use reduce to sum the total number of recommended activities
								//var total_rec_activities = Object.values(map_topic_max_rank_rec_act).reduce(add);
								
								//We use the total number of recommendations shown that is coming from vis.js in MG through the array top_recommended_activities
								var total_rec_activities = top_recommended_activities.length;
								map_rank_to_seq = 1-(rank_rec/total_rec_activities);
								console.log(rank_rec+": rank_rec")
							}else{
								//TODO write here what happen if the proactive method is km
								if(data.configprops.agg_proactiverec_method=="km"){
									if(rank_rec===0){
										map_rank_to_seq = 1;
									}else{
										if(rank_rec===1){
											map_rank_to_seq = 0.7;
										}else{
											if(rank_rec===2){
												map_rank_to_seq = 0.3;
											}else{

												map_rank_to_seq = 0.0;	

											}
										}
									}
								}
							}
							
							
							
							
							d3.select(this)
								.append("svg:polygon")
								//.attr("id", "star_1")
								.attr("visibility", "visible")
								//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
								.attr("points", function (d) {  
									d.seq = map_rank_to_seq;
									var R = scaleRecommendationStar(d.seq);
									var r = R * innerRatio;
									var cx=6;
									var cy=6;
									var pts = starPoints(cx, cy, R, r, numPoints);
									return ( d.seq === 0 ? "0,0" :pts) })
								.attr("style", function (d) { return `fill: ${CONST.vis.colors.sequencing};`; })
								//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
								.attr("stroke", "white")
								.attr("max_rec_rank_act",rank_recommended_activities[act_id])
								.attr("class","act_topic "+state.args.learningGoalForRec)
								.style("shape-rendering", "geometricPrecision")
								.style("pointer-events","none");
							
							d3.select(this)
								.append("text").
								attr("x", 15).
								attr("y", 15).
								attr("class", "rec_act_rank_txt").
								style("text-anchor", "start").
								text(function (d) {
									if(data.configprops.agg_proactiverec_method=="remedial" || state.args.learningGoal!=undefined){
										return d.rank_rec+1;
									}else{
										if(data.configprops.agg_proactiverec_method=="km"){
										if(d.seq === 1) {
											return " 1";
										} else if (d.seq === 0.7) {
											return " 2";
										} else if (d.seq === 0.3){
											return " 3";
										} else{
											return "";
										}
									}
									}
									
									
									
								
								/*if(d.seq === 1) {
									return "+6";
								} else if (d.seq === 0.7) {
									return "+4";
								} else {
									return "+2";
								}*/
								})
								.attr("font-family", "sans-serif")
										.attr("font-size", "12px")
								.attr("style", function(d) {
									var colorIndex = Math.round(data.vis.color.value2color(d.val)*10);
									var color = colorbrewer.Oranges[9][8-Math.min(colorIndex,8)];
									return "fill: " + color + ";"; 
								})
								.style("pointer-events","none");
						};
					}
					
				});
			}
		}
	}else{
		d3.selectAll("g.grid-cell-outter").each( function(d, i){
					var current_topic = data.topics[d.topicIdx]
					var mg_activities = current_topic ? current_topic.activities:undefined;
					var data_resource = data.resources[d.resIdx]
					var data_resource_id = data_resource ? data_resource.id:undefined;
					var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
					var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
					//var mg_activity = data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]
					if(mg_activity) {
						//var act_id = mg_activity.id
						//var act_name = d.actName;
						var act_is_recommended = d.seq>0 ? true : false;
						//var act_is_recommended = (act_id in rank_recommended_activities);
						//mg_activity['actIdx'] = d.actIdx
						//mg_activity['topicIdx'] = d.topicIdx
						//mg_activity['resIdx'] = d.resIdx
		
							d3.select(this)
								.append("svg:polygon")
								//.attr("id", "star_1")
								.attr("visibility", "visible")
								//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
								//.attr("points", function (d) { return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
								.attr("points", function(d){
									var R = scaleRecommendationStar(d.seq);
									var r = R * innerRatio;
									var cx=6;
									var cy=6;
									var pts = starPoints(cx, cy, R, r, numPoints);
									return ( d.seq === 0 ? "0,0" : pts);
								})
								.attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
								//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
								.attr("stroke", "white")
								//.attr("max_rec_rank_act",rank_recommended_activities[act_id])
								.attr("class","act_topic")
								.style("shape-rendering", "geometricPrecision")
								.style("pointer-events","none");
							
							d3.select(this)
								.append("text").
								attr("x", 15).
								attr("y", 15).
								attr("class", "rec_act_rank_txt").
								style("text-anchor", "start").
								text(function (d) {
									if(d.seq === 1) {
										return "1";
									} else if (d.seq === 0.7) {
										return "2";
									} else if(d.seq ===0.3){
										return "3";
									}else{
										return "";
									}
								})
								.attr("font-family", "sans-serif")
										.attr("font-size", "12px")
								.attr("style", function(d) {
									var colorIndex = Math.round(data.vis.color.value2color(d.val)*10);
									var color = colorbrewer.Oranges[9][8-Math.min(colorIndex,8)];
									return "fill: " + color + ";"; 
								})
								.style("pointer-events","none");
						//};
					}
					
				});
	}    

	//add stars to the topic based on the maximum rank of the recommended activities per topic
	d3.selectAll("g.grid-cell-outter").each( function(d){
            var topic_name = d3.select(this).attr("topic");
            var topic_has_recommended_acts = (topic_name in map_topic_max_rank_rec_act);
            console.log(topic_name+" has rec acts: "+topic_has_recommended_acts)
            if(topic_has_recommended_acts){
              addRecommendationStarToTopic(d3.select(this),topic_name)
            };
        });
}

function generateProactiveRecommendations(method){
	if(method=="km"){
		console.log("Generate KM recommendations....");

		var topic = getTopic();

		if (topic==null) return;

		var usr_index=data.learners.indexOf(data.learners.filter(function(d){return d.id==state.curr.usr})[0]);
		recommended_activities = generateKMRecommendations(topics_concepts, topic, data.learners[usr_index].state.activities, data.learners[usr_index].state.kcs, data.kcs, 0.5);
	
		top_recommended_activities = recommended_activities.slice(0,3);
		rank_recommended_activities = {};
	
		console.log("Top recommended activities:");
		console.log(top_recommended_activities);
			
		//Here we get the maximum rank of the items recommended per topic
		for(var i=0;i<top_recommended_activities.length;i++){
		  var rec_act_topic = top_recommended_activities[i]["topic"];
		  var rec_act_name  = top_recommended_activities[i]["name"];
		  var rec_act_id  = top_recommended_activities[i]["id"];
		  if (!(rec_act_topic in map_topic_max_rank_rec_act)){
			map_topic_max_rank_rec_act[rec_act_topic] = i;
		  }
		  rank_recommended_activities[rec_act_id] = i;
		}
	
		//Post array of recommended activities to the server (http://pawscomp2.sis.pitt.edu/recommendations/LogRecommendations)
		if(recommended_activities.length>0){
			//Prepare the array of recommendations for storing it in ent_recommendation db in the server (rec schema)
			for(var j=0;j<recommended_activities.length;j++){
			  var rec_act_id  = recommended_activities[j]["id"];
			  if (rec_act_id in rank_recommended_activities){
				recommended_activities[j]["isRecommended"]="1";
			  }else{
				recommended_activities[j]["isRecommended"]="0";
			  }
			}
			//console.log(recommended_activities);
			var millisecondsDate = (new Date).getTime();
			$.ajax({
			  type: "POST",
			  data :JSON.stringify({"usr":state.curr.usr,
			  "grp":state.curr.grp,
			  "sid":state.curr.sid,
			  "cid":state.curr.cid,
			  "sid":state.curr.sid,
			  "logRecId":millisecondsDate.toString(),
			  "recMethod":"bn-KM",
			  "recommendations":recommended_activities}),
			  url: "http://" + CONST.hostName + "/recommendation/LogRecommendations",
			  contentType: "application/json"
			});
		}
	  }
}

function sortKCSByLearningGoal(learningGoal){
	/**
	 * Sort the kcs by their learning goal
	 * 0: remedial recommendations - sort from low level of knowledge to high level of knowledge
	 * if zero, we need to verify if the number of attempts is greater than 0 (if not, the concept matches best with the goal
	 * filling knowledge gaps	
	 *  * 
	 * 1: filling knowledge gaps - sort based on the knowledge level either estimated or edited by the students
	 * first the ones with zero knowledge level and zero attempts, then the ones with zero estimated knowledge but edited positiviely by the student
	 * and then all the rest sorted incrementally basedd on the knowledge level
	 */
	//remove all existing attribute disabledForRec before adding that attribute in other context (3 LGs)
	data.kcs.forEach(function(kc) {
		delete kc.disabledForRec
	})
	//remedial recommendations
	if (learningGoal==0){
		data.kcs.forEach(function(kc) {
			kc.disabledForRec = false;
            let uk = typeof kc.uk === 'number' ? kc.uk : 0;
			let att = typeof kc.a === 'number' ? kc.a : 0;
			let sr = typeof kc.sr === 'number' ? kc.sr : 0;
			let lastksr = typeof kc.lastksr === 'number' ? kc.lastksr : 0;
            let edition = typeof kc.edition === 'number' ? editImpactValues.get(kc.edition) : 0;
            let total_uk = uk + edition;
            if (isNaN(total_uk)) total_uk = 0;
            if (total_uk < 0) total_uk = 0;
            if (total_uk > 1) total_uk = 1;
            kc.total_uk = total_uk;

			//disable concepts that have never been attempted and have an estimated knowledge level of zero
			if(att<2 || (att==0 && uk==0 && edition>0)){
				kc.disabledForRec = true;
			}
        });

        data.kcs.sort(function(a, b) {
			// Disabled concepts should be considered smaller (sorted to the end)
    		if (a.disabledForRec === true && b.disabledForRec !== true) return 1;
    		if (b.disabledForRec === true && a.disabledForRec !== true) return -1;

			// Handle NaN values for diff by treating them as 0
			const diffA = isNaN(a.diff) ? 0 : a.diff;
			const diffB = isNaN(b.diff) ? 0 : b.diff;
			const bothNaN = isNaN(a.diff) && isNaN(b.diff);

			if (bothNaN) {
				// Sort by ascending total_uk if both diffs are NaN
				const totalUkA = typeof a.total_uk === 'number' ? a.total_uk : 0;
				const totalUkB = typeof b.total_uk === 'number' ? b.total_uk : 0;
				return totalUkA - totalUkB;
			}
			// If diffs are equal, sort by normalized attempts (a.a / a.cnt.length)
			if(diffA==diffB){
				const normalizedAttA = a.a/a.cnt.length
				const normalizedAttB = b.a/b.cnt.length
				return normalizedAttB - normalizedAttA; //tie breaker: more normalized attempts first
			}
			// Otherwise, sort by descending diff
			return diffB - diffA;
		});

		console.log("KCs sorted by difficulty:");
		console.log(data.kcs);
	}
	//knowledge gaps
	if(learningGoal==1){
		
		//lower limit attempts to consider a concept as a knowledge gap
		let lower_limit_attempts = 1;
		//lower limit knowledge gap to consider a concept as a knowledge gap
		let lower_limit_kc_knowledge_gap = 0.25
		//filling knowledge gaps
		data.kcs.forEach(function(kc) {
			kc.disabledForRec = false;
            let uk = typeof kc.uk === 'number' ? kc.uk : 0;
			let att = typeof kc.a === 'number' ? kc.a : 0;
            let edition = typeof kc.edition === 'number' ? editImpactValues.get(kc.edition) : 0;
            let total_uk = uk + edition;
            if (isNaN(total_uk)) total_uk = 0;
            if (total_uk < 0) total_uk = 0;
            if (total_uk > 1) total_uk = 1;
            kc.total_uk = total_uk;
			if((kc.recencyPriority==2 || kc.recencyPriority==0) || total_uk>lower_limit_kc_knowledge_gap || (total_uk==0.0 && att>lower_limit_attempts)){//knowledge gap should be concepts that have never been attempted or it has been attempted a very low number of times (1 maybe)
				kc.disabledForRec = true;
			}
        });
		// Sort in place by total attempts, tie-breaker: lowest total_uk
        data.kcs.sort((a, b) => {
			// Disabled concepts should be considered smaller (sorted to the end)
    		if (a.disabledForRec === true && b.disabledForRec !== true) return 1;
    		if (b.disabledForRec === true && a.disabledForRec !== true) return -1;

			const attA = typeof a.a === 'number' ? a.a : 0;
			const attB = typeof b.a === 'number' ? b.a : 0;
			if (attB != attA) return attA - attB; // Primary sort: ascending

			const totalA = a.total_uk || 0;
			const totalB = b.total_uk || 0;
			if(totalA!==totalB) return totalA - totalB

			const recencyA = typeof a.recencyPriority === 'number' ? a.recencyPriority : 0
			const recencyB = typeof b.recencyPriority === 'number' ? b.recencyPriority : 0
			return recencyB - recencyA;//descending recency in case the number of attempts and total uk are the same
			
		});

		console.log("KCs sorted by attempts:");
		console.log(data.kcs);
	}

	//Keep me up with the class
	//Here we should sort the concepts based on the recency of the topics covered in class
	//First the concepts of the current topic, then the concepts of the previous topics based on the order of the topics
	//We assume that data.topics have an attribute order that indicates the order of the topics in the course
	//In case of a tie, we sort based on the knowledge level either estimated or edited by the students (ascending order)
	if(learningGoal==2){
		data.kcs.forEach(function(kc) {
			kc.disabledForRec=false;
			if(kc.recencyPriority==0){
				kc.disabledForRec=true;
			}
		})
		
		data.kcs.sort((a, b) => {
			const recA = a.recencyPriority || 0;
			const recB = b.recencyPriority || 0;
			if (recA !== recB) return recB - recA;
			const orderA = typeof a.topicOrder === 'number' ? a.topicOrder : 0;
			const orderB = typeof b.topicOrder === 'number' ? b.topicOrder : 0;
			return orderB - orderA;
		});

		console.log("KCs sorted by recency:");
		console.log(data.kcs);
	}
}
function setTopConceptsForRecommendations(num_concepts){
    // Get the container div
    const container = document.querySelector('.concept-selection-options');
    if (!container) return;
    container.innerHTML = ''; // Clear previous content

	// Only include kcs that do not have disabledForRec or have it set to false
	const filteredKcs = data.kcs.filter(kc => kc.disabledForRec == false || typeof kc.disabledForRec === 'undefined');
	//const sortedKcs = [...filteredKcs].sort((a, b) => (a.total_uk || 0) - (b.total_uk || 0));
	const topKcs = filteredKcs.slice(0, num_concepts);
	console.log("About to set the top kcs...")
	console.log(topKcs.length)
    topKcs.forEach((kc, idx) => {
        // Calculate values
        const uk = typeof kc.uk === 'number' ? kc.uk : 0;
        const edition = typeof kc.edition === 'number' ? kc.edition : 0;
        let total = uk + edition;
        if (isNaN(total)) total = 0;
        if (total < 0) total = 0;
        if (total > 1) total = 1;
		kc.name = kc.dn
		kc.selectedForRec = true; // Default to selected
		console.log("this is a new row...")
        var row = createConceptBarRow(kc, label_top=true, add_checkbox=state.args.kcSelectionForRec);
		
		container.appendChild(row);

		

    });

	var sideKCsInfoDivVisible = getComputedStyle(document.querySelector('#div-kcs-inspection')).display;
	if(sideKCsInfoDivVisible!="none"){
		openConceptsModal();
	}

	let moreKCsButtonDiv = document.createElement('div')
	var spanButton = "<span data-i18n='inspectMoreConcepts'></span>"
	if(state.args.kcSelectionForRec){
		spanButton = "<span data-i18n='selectMoreConcepts'></span>"
	}
	moreKCsButtonDiv.innerHTML = '<button id="inspect-concepts-btn" class="inspect-concepts-btn" onclick="openConceptsModal()">'+spanButton+'</button>'
	container.appendChild(moreKCsButtonDiv)
	updateAllText();

	var div_kcs = document.querySelector("#concept-selection-options")
    div_kcs.style.disabled = false;
    div_kcs.style.filter = 'none';
	div_kcs.style.pointerEvents = 'auto';
	
}

// Helper function to update data.kcs when a checkbox is toggled
function selectConceptForRecommendation(conceptId, isChecked) {
    const kc = data.kcs.find(k => k.id == conceptId);
    if (kc) {
        kc.selectedForRec = !!isChecked;
    }
}

function showCustomModal(message) {
    // Remove existing modal if present
    const existing = document.getElementById('custom-modal');
    if (existing) existing.remove();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'custom-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    // Create modal box
    const modal = document.createElement('div');
    modal.style.background = '#fff';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    modal.style.padding = '32px 28px 20px 28px';
    modal.style.maxWidth = '400px';
    modal.style.textAlign = 'center';
    modal.style.fontFamily = 'sans-serif';

    // Modal content
    const msg = document.createElement('div');
    msg.style.fontSize = '15px';
    msg.style.marginBottom = '24px';
    msg.innerText = message;

    const btn = document.createElement('button');
    btn.innerText = 'OK';
    btn.style.padding = '8px 24px';
    btn.style.fontSize = '15px';
    btn.style.background = '#1976d2';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.onclick = function() {
        overlay.remove();
    };

    modal.appendChild(msg);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function addRecencyDataToKCs(){
	data.kcs.forEach(function(kc) {
		//assign priority to the current concept based on its recency
		//first check if the concept belongs to the current topic
		console.log(kc);
		const topic = data.topics.find(t => t.name == kc.t);
		var recencyPriority = 0
		if(Object.hasOwn(topic,'timeline')){
			//console.log("Topic timeline found for concept: ");
			//console.log(topic)
			if(topic.timeline.current){
				recencyPriority = 2 //2 ->current topic
			}else{
				if(topic.timeline.covered){
					recencyPriority = 1 //1 -> past topic
				}else{
					recencyPriority = 0 //0 -> future topic
				}
			}
		}
		kc.recencyPriority = recencyPriority;
		kc.topicOrder = Number(topic.order) || 0;
	})
}