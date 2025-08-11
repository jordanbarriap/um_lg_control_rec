//Topics which have activities that should not be recommended
var non_recommended_topics = ["Table Creation", "Table Deletion and Alteration", "Key Constraints", "Tuple Insertion", "Tuple Deletion", "Tuple Update", "General Constraints", "Derived Relations and Views"];
var proficiency_threshold = .5;
var topic_progress_limit = .1
var last_success_rate_limit = .5
var knowledge_level_limit = .5

// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Fill knowledge gaps
 * Generate a list of content covering concepts that the student has not yet attempted
 * or where the student has not shown or modified their proficiency. Hence priority is given 
 * to examples first and then more complex content
**/
function prepareFillKnowledgeGapRecommendations(){
	alert("prepare fill knowledge gaps recommendations");
	sortKCSByLearningGoal(1)
	setTopConceptsForRecommendations(6);
}

function prepareRemedialRecommendations(){
	alert("prepare remedial recommendations");
	sortKCSByLearningGoal(0)
	setTopConceptsForRecommendations(6);
}

function generateFillKnowledgeGapRecommendations(data_topics_acts_kcs, user_state, kc_topic_weights, weight_kcs, weight_sr,selected_kcs_ids){
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
		for (var j=0; j<n_resources;j++){
			var resource_id = resources[j];
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var rec_score = 0;
				var weights_sum = 0;
				var helpful_kcs_number = 0;
				var problematic_kcs = 0;
				var slip_kcs = 0;

				var act_progress = topic_activities[resource_id][activity.id].values.p;

				//Total number of concepts needed for solving the problem / understanding the example
				var total_kcs = 0;
				var kcs_for_recommendation = []

				var misconception_kcs = []
				var helpful_kcs = []

				for (var l=0;l<kcs.length;l++){
					var kc_id = kcs[l];
					if (kc_id in kc_levels){
					}
				}
			}
		}
	}
}




// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Remedial
 * Generate a list of recommended content list based on problematic concepts and  
 * knowledge level infered for kcs
 */
function generateRemedialRecommendations(data_topics_acts_kcs, user_state, kc_topic_weights, weight_kcs, weight_sr){
	kc_levels = user_state.kcs
	topic_levels = user_state.topics

	var filtered_kcs = kc_topic_weights.map(function(d){return d.id});
	console.log(filtered_kcs)
	//get the ids from the selected kcs
	selected_kcs_ids = data.kcs.filter(function(d){return !d.disabledForRec && d.selectedForRec}).map(function(d){return d.id});

	//further filter the kc_levels to keep only those that have been selected by the users
	// further filter the kc_levels to keep only those that have been selected by the users
	filtered_kcs = selected_kcs_ids //filtered_kcs.filter(function(d){ return selected_kcs_ids.includes(d); });

	console.log(selected_kcs_ids)
	
	
	var filtered_kc_levels = {};
	for (var i=0; i<filtered_kcs.length;i++){
		var kc_id = filtered_kcs[i];
		if (kc_levels.hasOwnProperty(kc_id)) {
            filtered_kc_levels[kc_id] = kc_levels[kc_id];
        }
	}
  
	kc_levels = filtered_kc_levels;
	calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr);
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

		if(!non_recommended_topics.includes(topic_name) && topic_levels[topic_name].overall.p >= topic_progress_limit) {
			for (var j=0; j<n_resources;j++){
				var resource_id = resources[j];
				var activities = topic.activities[resource_id];
				var n_activities = activities.length;
				for (var k=0;k<n_activities;k++){
					var activity = activities[k];
					var kcs = activity["kcs"];
					var rec_score = 0;
					var weights_sum = 0;
					var helpful_kcs_number = 0;
					var problematic_kcs = 0;
					var slip_kcs = 0;

					var act_progress = topic_activities[resource_id][activity.id].values.p;
	
					//Total number of concepts needed for solving the problem / understanding the example
					var total_kcs = 0;
					var kcs_for_recommendation = []

					var misconception_kcs = []
					var helpful_kcs = []
					console.log("act")
					console.log(activity)
	
					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];
						if (kc_id in kc_levels){
							var kc_diff = kc_levels[kc_id]["diff"];
							if(kc_diff>=0){
								total_kcs ++;
								var kc_weight = topic.concepts.filter(function(d){return d.id==kc_id;})[0].weight;
								rec_score = rec_score + (kc_weight*kc_diff);
								weights_sum = weights_sum + kc_weight;
	
								var kc_level = kc_levels[kc_id]["k"];
								var kc_lastksr= kc_levels[kc_id]["lastk-sr"];
								var kc_lastk_att = kc_levels[kc_id]["lastk-att"];
								var kc_sr = kc_levels[kc_id]["sr"];
								var kc_att = kc_levels[kc_id]["a"];
								
								if(kc_level>= knowledge_level_limit){
									if(kc_att > 0 && kc_sr <= last_success_rate_limit){
									//if(kc_lastk_att > 0 && kc_lastksr <= last_success_rate_limit){
										misconception_kcs.push({"name": data.kcs.filter(function(d){return d.id == kc_id;})[0].dn , "lastksr": kc_lastksr})
										//if (kc_level < proficiency_threshold){
										problematic_kcs ++;
										//} else{
										//	slip_kcs ++;
										//}
		
										//if (kc_level >= knowledge_level_limit){
										kcs_for_recommendation.push(kc_levels[kc_id])
										condition_to_generate_recommendations = true;
										//}
									}
									else{// if(kc_level >= knowledge_level_limit){// && (kc_lastksr == -1 || kc_lastksr>.5)){
										var helpfulkc = data.kcs.filter(function(d){return d.id == kc_id;})[0]
										helpful_kcs.push({"name": helpfulkc.dn , "kclevel": kc_level, "lastksr":kc_lastksr})

										helpful_kcs_number ++;
									}
								}else{
									//console.log(kc_id + " on-learning concept");

								}
								
							}
							
						}	
					}
					

					// Only add this activity to the recommended activity list:
					// This activity has at least 1 KC which satisfies the following criteria:
					// 1. Belong to a topic not listed as non_recommended_topics	  
					// 2. Belong to a topic whose average progress is >= topic_progress_limit
					// 3. Attempted at least once in last k attempts
					// 4. Has knowledge level >= .5
					// 5. Has last k success rate <= .5


					if(kcs_for_recommendation.length>0){// && act_progress<.5){
						if (weights_sum>0){
							rec_score = rec_score/weights_sum;//Normalizing rec score with total of the sum of weights (?)
						}

						misconception_kcs = misconception_kcs.sort((a, b) => (a.lastksr < b.lastksr) ? 1 : -1)
						helpful_kcs = helpful_kcs.sort((a, b) => (a.kclevel < b.kclevel) ? 1 : -1)

		
						var rec_explanation = "This activity is recommended because:<ul>";
		
						if ((problematic_kcs+slip_kcs)>0){
							rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concept(s) which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past (e.g. "+misconception_kcs[0].name+").</li>"
							//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
							// Peter suggested to hide this part of the explanation
							// if (slip_kcs){
							// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
							// }
							//rec_explanation = rec_explanation + "<br>";
						}
						if (helpful_kcs_number>0){
							rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs_number+"</b> concept(s)</b> that are necessary to ";//out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
							var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 || activity["url"].indexOf("sqltutor")>=0;
							var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
							if(is_sqlknot){
								rec_explanation = rec_explanation + " solve this problem.";
							}else{
								if(is_example){
									rec_explanation = rec_explanation + " understand this example.";
								}
							}	

							rec_explanation = rec_explanation + "(e.g. " + helpful_kcs[0].name + ")</li>"

						}
					
						rec_explanation = rec_explanation + "</ul>";
	
						ranked_activity = Object.assign({}, activity);
						ranked_activity["rec_score"] = 1-Math.abs(.5-rec_score);//rec_score;
						ranked_activity["topic"] = topic_name;
						ranked_activity["explanation"] = rec_explanation;
						recommendations.push(ranked_activity);
					}
					
				}
			}
		}
	}
	recommendations.sort(compareActivities);

	return recommendations;
}

/***
Peter's explanation text:
- It allows you to practice X concepts, which might have caused problems in the past
- It is not too complicated for -- you have good knowledge of Y concepts out of Z necessary to solve this problem [or “To understand this example”]
***/


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

						var rec_explanation = "This example is recommended because it presents <span class='important-text'>concept(s) that are new</span> to you (e.g. <i>"+kc_topic_weights.filter(function(d){return d.id==overlap_non_attempted_outcomes_kcs[0];})[0].dn+"</i>).";

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
							prerequisite_explanation+="<li>It looks like on average you <span class='level1-exp-text'>master</span> the main <span class='important-text'>prerequisite concepts</span>.</li>";
						}else{
							if(avg_k_prerequisite_concepts>=proficiency_threshold){
								prerequisite_explanation+="<li>It looks like on average you are <span class='level2-exp-text'>proficient</span> in the main <span class='important-text'>prerequisite concepts</span>.</li>";
							}else{
								if(avg_k_prerequisite_concepts>=good_threshold){
									prerequisite_explanation+="<li>It looks like on average you have a <span class='level3-exp-text'>good</span> understanding in the main <span class='important-text'>prerequisite concepts</span>.</li>";
								}else{
									prerequisite_explanation+="<li>Although it is low, your knowledge level on the main <span class='important-text'>prerequisite concepts</span> is one of the highest within the topic.</li>";
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
							outcome_explanation+="<li>You have an <span class='level1-exp-text'>excellent</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
						}else{
							if(avg_k_outcome_concepts>=good_opportunity_threshold){
								outcome_explanation+="<li>You have a <span class='level2-exp-text'>good</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
							}else{
								if(avg_k_outcome_concepts>=fair_opportunity_threshold){
									outcome_explanation+="<li>You have a <span class='level3-exp-text'>fair</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
								}else{
									outcome_explanation+="<li>Although it is low, the opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic is one of the highest within the topic.</li>";
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
  var kcs_ids = Object.keys(kc_levels);
  for(var i=0;i<kcs_ids.length;i++){
  	var kc_id = kcs_ids[i];
  	var kc_level = kc_levels[kc_id]["k"];
  	var lastk_sr = kc_levels[kc_id]["lastk-sr"];
  	var overall_sr = kc_levels[kc_id]["sr"];
  	var kc_difficulty_score = - 1;
  	if(lastk_sr>0){
  		kc_difficulty_score = 1 - (lastk_sr*weight_sr + kc_level*weight_kcs);
  	}else{
  		if(overall_sr>0){
  			kc_difficulty_score = 1 - (overall_sr*weight_sr + kc_level*weight_kcs);
  		}else{
  			kc_difficulty_score = 1;
  		}
  	}
  	kc_levels[kc_id]["diff"]=kc_difficulty_score;
  }
}


function addRecommendationsToUI(){
	//console.log("Add recommendation to UI...");
	//console.log(top_recommended_activities);

	//Remove existing stars
	d3.selectAll(".recommendationStar").remove();
	d3.selectAll(".recommended_act").classed("recommended_act",false);

	if(data.configprops.agg_proactiverec_method=="km" || data.configprops.agg_proactiverec_method=="remedial" || state.args.learningGoal!=undefined){
		if(top_recommended_activities && top_recommended_activities.length > 0) {
			
			//var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().name)
			var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().id)
			
			if(topic_rec_activities.length > 0) {

				//console.log("Rank recommended activities:");
				//console.log(rank_recommended_activities);

				d3.selectAll("g.grid-cell-outter").each( function(d, i){
					var current_topic = data.topics[d.topicIdx]
					var mg_activities = current_topic ? current_topic.activities:undefined;
					var data_resource = data.resources[d.resIdx]
					var data_resource_id = data_resource ? data_resource.id:undefined;
					var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
					var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
					//var mg_activity = data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]
					if(mg_activity) {
						var act_id = mg_activity.id
						var act_name = d.actName;
						var act_is_recommended = (act_id in rank_recommended_activities);
						mg_activity['actIdx'] = d.actIdx
						mg_activity['topicIdx'] = d.topicIdx
						mg_activity['resIdx'] = d.resIdx

						if(act_is_recommended){

							//This is to fix the globally stored top_recommended_activities array. (To solve the problem of first topic openning)
							let recommended_activity = top_recommended_activities.find(x => x.id === mg_activity.id)
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
							var map_rank_to_seq = -1;

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
							//TODO write here what happen if the proactive method is remedial
							if(data.configprops.agg_proactiverec_method=="remedial"){
								// function for adding two numbers.
								const add = (a, b) => a + b
								// use reduce to sum the total number of recommended activities
								//var total_rec_activities = Object.values(map_topic_max_rank_rec_act).reduce(add);
								
								//We use the total number of recommendations shown that is coming from vis.js in MG through the array top_recommended_activities
								var total_rec_activities = top_recommended_activities.length;
								map_rank_to_seq = 1-(rank_rec/total_rec_activities);
							}
							
							
							d3.select(this)
								.append("svg:polygon")
								//.attr("id", "star_1")
								.attr("visibility", "visible")
								//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
								.attr("points", function (d) { d.seq = map_rank_to_seq; return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
								.attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
								//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
								.attr("stroke", "white")
								.attr("max_rec_rank_act",rank_recommended_activities[act_id])
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
									if(data.configprops.agg_proactiverec_method=="remedial"){
										return rank_rec+1;
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
								.attr("points", function (d) { return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
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
	//remedial recommendations
	if (learningGoal==0){
		data.kcs.forEach(function(kc) {
            let uk = typeof kc.uk === 'number' ? kc.uk : 0;
			let att = typeof kc.a === 'number' ? kc.a : 0;
            let edition = typeof kc.edition === 'number' ? kc.edition : 0;
            let total_uk = uk + edition;
            if (isNaN(total_uk)) total_uk = 0;
            if (total_uk < 0) total_uk = 0;
            if (total_uk > 1) total_uk = 1;
            kc.total_uk = total_uk;
			if(att==0 || (att==0 && total_uk==0 && edition<0)){
				kc.disabledForRec = true;
			}
        });

        data.kcs.sort(function(a, b) {
            return a.total_uk - b.total_uk;
        });
	}
	//knowledge gaps
	if(learningGoal==1){
		data.kcs.forEach(function(kc) {
            let uk = typeof kc.uk === 'number' ? kc.uk : 0;
			let att = typeof kc.a === 'number' ? kc.a : 0;
            let edition = typeof kc.edition === 'number' ? kc.edition : 0;
            let total_uk = uk + edition;
            if (isNaN(total_uk)) total_uk = 0;
            if (total_uk < 0) total_uk = 0;
            if (total_uk > 1) total_uk = 1;
            kc.total_uk = total_uk;
			if(total_uk==0){
				kc.disabledForRec = true;
			}
        });

        data.kcs.sort(function(a, b) {
            return a.total_uk - b.total_uk;
        });
	}

	/*if(learningGoal==2){

	}*/
}
function setTopConceptsForRecommendations(num_concepts){
    // Get the container div
    const container = document.querySelector('.concept-selection-options');
    if (!container) return;
    container.innerHTML = ''; // Clear previous content

    // Defensive: sort by total_uk descending (if not already sorted)
	// Only include kcs that do not have disabledForRec or have it set to false
	const filteredKcs = data.kcs.filter(kc => !kc.hasOwnProperty('disabledForRec') || kc.disabledForRec === false);
	const sortedKcs = [...filteredKcs].sort((a, b) => (a.total_uk || 0) - (b.total_uk || 0));
	const topKcs = sortedKcs.slice(0, num_concepts);

    topKcs.forEach((kc, idx) => {
        // Calculate values
        const uk = typeof kc.uk === 'number' ? kc.uk : 0;
        const edition = typeof kc.edition === 'number' ? kc.edition : 0;
        let total = uk + edition;
        if (isNaN(total)) total = 0;
        if (total < 0) total = 0;
        if (total > 1) total = 1;
		console.log(edition)
		console.log(kc.dn+" "+total)

        // Create row
        const row = document.createElement('div');
        row.className = 'concept-bar-row';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '6px';
        row.style.marginBottom = '2px';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'concept-checkbox-html';
        checkbox.style.marginRight = '4px';
        checkbox.checked = !!kc.selectedForRec;
        checkbox.onclick = function() {
            selectConceptForRecommendation(kc.id, checkbox.checked);
        };
        row.appendChild(checkbox);

        // Label
        const label = document.createElement('span');
        label.className = 'concept-label-html';
        label.title = kc.dn || kc.name || `Concept ${idx + 1}`;
        label.innerText = (kc.dn || kc.name || `Concept ${idx + 1}`).length > 12
            ? (kc.dn || kc.name || `Concept ${idx + 1}`).substring(0, 12) + '...'
            : (kc.dn || kc.name || `Concept ${idx + 1}`);
        row.appendChild(label);

        // Bar container (flex-based, no absolute positioning)
		const barContainer = document.createElement('div');
		barContainer.className = 'concept-mastery-bar';
		barContainer.style.display = 'flex';
		barContainer.style.height = '12px';
		barContainer.style.width = '75px';
		barContainer.style.background = '#f0f0f0';
		barContainer.style.borderRadius = '3px';
		barContainer.style.overflow = 'hidden';
		barContainer.style.position = 'relative';

		// Original value bar (uk)
		if (uk > 0) {
			const origBar = document.createElement('div');
			//origBar.className = 'bar-original-html';
			origBar.className = 'concept-mastery-fill';
			origBar.style.width = (uk*100)+'%';
			origBar.style.background = '#bbb';
			origBar.style.opacity = '0.6';
			origBar.style.height = '100%';
			barContainer.appendChild(origBar);
		}

		// Edition bar (positive or negative) with hatching pattern
		if (edition !== 0) {
			const editionBar = document.createElement('div');
			editionBar.style.flex = Math.abs(edition);
			editionBar.style.height = '100%';
			editionBar.style.position = 'relative';
			editionBar.style.background = 'none';

			// Create SVG for hatching
			const svgNS = "http://www.w3.org/2000/svg";
			const svg = document.createElementNS(svgNS, "svg");
			svg.setAttribute('width', '100%');
			svg.setAttribute('height', '100%');
			svg.setAttribute('viewBox', '0 0 10 12');
			svg.style.position = 'absolute';
			svg.style.top = '0';
			svg.style.left = '0';
			svg.style.width = '100%';
			svg.style.height = '100%';
			svg.style.pointerEvents = 'none';

			// Define pattern
			const pattern = document.createElementNS(svgNS, "pattern");
			pattern.setAttribute('id', `hatch-${kc.id}-${idx}`);
			pattern.setAttribute('patternUnits', 'userSpaceOnUse');
			pattern.setAttribute('width', '3');
			pattern.setAttribute('height', '6');
			pattern.setAttribute('patternTransform', 'rotate(45)');

			const color = edition > 0 ? '#4caf50' : '#f44336';

			// Draw lines for hatching
			const line = document.createElementNS(svgNS, "rect");
			line.setAttribute('x', '0');
			line.setAttribute('y', '0');
			line.setAttribute('width', '2');
			line.setAttribute('height', '6');
			line.setAttribute('fill', color);
			line.setAttribute('opacity', '0.5');
			pattern.appendChild(line);

			svg.appendChild(pattern);

			// Use pattern as fill
			const rect = document.createElementNS(svgNS, "rect");
			rect.setAttribute('x', '0');
			rect.setAttribute('y', '0');
			rect.setAttribute('width', '100%');
			rect.setAttribute('height', '100%');
			rect.setAttribute('fill', `url(#hatch-${kc.id}-${idx})`);
			svg.appendChild(rect);

			editionBar.appendChild(svg);

			// Assign class for possible further styling
			editionBar.className = edition > 0 ? 'bar-edition-positive-html' : 'bar-edition-negative-html';

			barContainer.appendChild(editionBar);
		}

		// Fill the rest with empty space if total < 1
		if (total < 1) {
			const emptyBar = document.createElement('div');
			emptyBar.style.flex = 1 - total;
			emptyBar.style.height = '100%';
			emptyBar.style.background = 'transparent';
			barContainer.appendChild(emptyBar);
		}

		// Value label (positioned absolutely over the bar)
		const valueLabel = document.createElement('span');
		valueLabel.className = 'concept-value-html';
		valueLabel.innerText = `${Math.round(total * 100)}%`;
		valueLabel.style.position = 'absolute';
		valueLabel.style.right = '4px';
		valueLabel.style.top = '1px';
		valueLabel.style.fontSize = '10px';
		valueLabel.style.color = '#222';
		valueLabel.style.background = 'rgba(255,255,255,0.7)';
		valueLabel.style.padding = '0 2px';
		valueLabel.style.borderRadius = '2px';
		barContainer.appendChild(valueLabel);

		row.appendChild(barContainer);

		

		container.appendChild(row);

		

    });

	let moreKCsButtonDiv = document.createElement('div')
	moreKCsButtonDiv.innerHTML = '<button id="inspect-concepts-btn" class="inspect-concepts-btn" onclick="openConceptsModal()">Inspect more concepts</button>'
	container.appendChild(moreKCsButtonDiv)
}

// Helper function to update data.kcs when a checkbox is toggled
function selectConceptForRecommendation(conceptId, isChecked) {
    const kc = data.kcs.find(k => k.id == conceptId);
    if (kc) {
        kc.selectedForRec = !!isChecked;
    }
}