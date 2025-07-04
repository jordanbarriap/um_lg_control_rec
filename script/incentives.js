/**
 * in JSON file, to override a topic incentive, put all required fields and the topicOrder 
 * {"topicOrder":10, "resource_ids":["psp"], "required_activity": 2, "points_per_activity": 1, "unique_type": false}
 */

var incentives = {
    parameters: null,
    credit_achievement: [],
    
    process_incentive_params: function(topics, incentive_params) {
        incentives.parameters = incentive_params
        incentive_params.topics = []

        for (var i=1; i <=topics.length ; i++) {
          var topic_param = Object.assign({topicOrder:i},incentive_params.topic_overall)
          incentive_params.topics.push(topic_param)
        }

        if(incentive_params.topic_specific.length != 0) {
          for (var i=1; i <= topics.length ; i++) {
            var overridden_topic = incentive_params.topic_specific.find(topic => topic.topicOrder == i)
            if(overridden_topic) {
              incentive_params.topics[i-1] = overridden_topic
            }
          }
        }
    },

    generate_status_text: function() {
      if(this.parameters.report_mode == "topic_level") {
        let requirements_satisfied = this.credit_achievement.filter(cr => cr == 1).length
        let total_required_topics = this.credit_achievement.filter(cr => cr != -1).length
        
        return t('incentives.required_exercises_completed', {requirements_satisfied, total_required_topics})
      } else if(this.parameters.report_mode == "total_credit") {
        var total_credit = 0
        var total_available_credit = 0

        for (var i=0; i < this.credit_achievement.length ; i++) {
          var topic_credit = this.credit_achievement[i]
          if(topic_credit > -1) {
            let credit_per_topic = this.parameters.topics[i].points_per_activity * this.parameters.topics[i].total_activity_per_topic
            total_credit += topic_credit * credit_per_topic
            total_available_credit += credit_per_topic
          } else if(topic_credit == -2) {
            let credit_per_topic = this.parameters.topics[i].points_per_activity * this.parameters.topics[i].total_activity_per_topic
            total_available_credit += credit_per_topic
          }
        }

        if(state.curr.grp.startsWith("AaltoPythonFall2020")) {
          return "Extra Points Earned: " + (data.vis.ui.params.user.earnedCredit? (total_credit + parseInt(data.vis.ui.params.user.earnedCredit)): total_credit) + "/" + total_available_credit
        } else {
          return "Extra Points Earned: " + total_credit  + "/" + total_available_credit
        }
        
      } 
    },

    generate_incentive_status: function(learner_data) {
      var topic_names = Object.keys(learner_data);
      var params = incentives.parameters
      var credit_achievement = []
    
      for (var i = 0; i < topic_names.length; i++){
          var topic_name = topic_names[i];
          var topic_data = learner_data[topic_name];
          
          var incentive_satisfied = [];
          var assessment_res_ids = params.topics[i].resource_ids
          var total_completed_assessments = 0
          var total_available_assessments = 0
          
          for (var j=0; j<assessment_res_ids.length;j++){
            var res_id = assessment_res_ids[j];
            var available_assessments = Object.keys(topic_data[res_id]);
            var completed_assessments = 0
            
            if(available_assessments.length > 0) {
              for (var k=0;k<available_assessments.length;k++){
                var act_name = Object.keys(topic_data[res_id])[k]
                var act_progress = topic_data[res_id][act_name]["values"]["p"];
                if(act_progress == params.topics[i].completion_progress_limit){
                  completed_assessments += 1;
                }
              }

              if(params.topics[i].mode == "resource_type") {
                incentive_satisfied[j] = completed_assessments >= params.topics[i].activity_per_resource[j]
              }
            } 

            total_completed_assessments += completed_assessments
            total_available_assessments += available_assessments.length
          }

          if(state.curr.grp.startsWith("AaltoPythonFall2020") && i < 12) {
            credit_achievement[i] = -2
          } else if(total_available_assessments > 0) {
            if(params.topics[i].mode == "total_topic") {
              if(total_completed_assessments >= params.topics[i].total_activity_per_topic) {
                 credit_achievement[i] = 1
              } else if(total_completed_assessments >= params.topics[i].total_activity_per_topic/2) {
                 credit_achievement[i] = .5
              } else {
                 credit_achievement[i] = 0
              }  
            } else if(params.topics[i].mode == "resource_type") {
              let satisfied_resources_length = incentive_satisfied.filter(is => is == true).length
              if(satisfied_resources_length == assessment_res_ids.length) {
                credit_achievement[i] = 1
              } else if(satisfied_resources_length == assessment_res_ids.length/2) {
                credit_achievement[i] = .5
              } else {
                credit_achievement[i] = 0
              }
              
            } 
          } else {
            credit_achievement[i] = -1
          }
      }

      incentives.credit_achievement = credit_achievement
      return credit_achievement
    }
}