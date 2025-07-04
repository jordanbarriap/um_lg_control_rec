const locales = {
    en: {
        title: {
            others: "Ranked list of students in the class",
            group: "Students in the class",
            topic_activity: "Topic: <b>${topic}</b> &nbsp; &bull; &nbsp; Activity: <b>${activity}</b>",
            topic: "TOPIC"
        },
        button: {
            close: "close",
            close_window: "Close window",
            hide: "Hide",
            show: "Show",
            set_goal: "Set Goal",
            set_a_goal: "Set a goal",
            submit_feedback: "Submit Feedback",
            enable: "Enable",
            disable: "Disable",
            show_peers: "Show Peers",
            all: "All",
            none: "None",
            save_peers: "Save Peers",
            loading: "Loading...",
        },
        help: {
            animated_examples: "Animated Examples Help",
            animated_examples_link: "Animated Examples Help page",
            help: "Help",
            color_scale: "Color Scale",
            extra_points: "Extra points",
            credit: "Credit",
            half_credit: "Half credit",
            no_credit: "No credit",
            lock: "Locked",
            metric: {
                grid: "My {metric} Grid",
                progress_grid: "My Progress Grid",
                comparison_grid: "Comparison Grid",
                group_grid: "Group Grid",
                group_progress: "Group progress"
            },
            metric_description: {
                me: "This row represents your {metric} in the topics of the course. Each topic is a cell. Gray means 0% {metric} in the topic and darker color means higher {metric}.",
                mevsgrp: "This row shows the <i>difference</i> between your {metric} and the average {metric} of other students in {groupName}. <span style='color: #006d2c;font-weight:bold;'>GREEN</span> color means you have higher {metric} than the others and <span style='color: #08519c;font-weight:bold;'>BLUE</span> color means the opposite. Gray means equal {metric}.",
                grp: "This row shows the average {metric} of other students in {groupName} using <span style='color: #08519c;font-weight:bold;'>BLUE</span> colors. Gray means 0% {metric} in the topic and darker color means higher {metric}."
            },
            progress_grid_description: "This grid represents your progress in the topics. Each topic is a column. First row shows average across different types of content. Other rows show progress within specific types of content (quizzes, examples). Gray means 0% progress and darker color means more progress.",
            comparison_grid_description: "This grid shows the <i>difference</i>  between your progress (<span style='color: #006d2c;font-weight:bold;'>GREEN</span>) and other students' progress (<span style='color: #08519c;font-weight:bold;'>BLUE</span>). The cell is colored depending on this difference: if you see a green cell, it means you are more advanced than the average of other students in the corresponding topic.",
            group_progress_description: "This grid shows the average progress of other students in the class. Depending on the set up of Mastery Grids, other students might include all the class or top students using <span style='color: #08519c;font-weight:bold;'>BLUE</span> colors.",
            extra_points_announcement: "Extra Points Announcement",
            extra_points_description: "This number reflects the extra points you have earned from the previous extra exercise rounds and the currently active one. <br/>You can keep practicing in topics that belong to previous rounds (topics without a checkmark). <br/>However, your activities in these earlier topics will not change the extra points you have already earned in the previous rounds.",
            topic_opening: "Topic Opening",
            topic_opening_desc: " means that the topic is not available for now.",
            animated_examples_title: "Animated Examples",
            animated_examples_not_graded: "Not counted towards grading",
            animated_examples_desc: "Animated Examples provide step by step visualization of the program execution. Each cell represents an animated example and the color of the cell shows your progress. Gray means 0% progress and darker colors mean higher progress.",
            examples_challenges_title: "Examples-Challenges",
            examples_challenges_desc: "Examples-Challenges consist of one code example and multiple challenges where you need to find the missing code lines. Each cell represents an examples-challenges set and the color of the cell shows your progress. Gray means 0% progress and darker colors mean higher progress.",
            tracing_problems_title: "Tracing Problems",
            tracing_problems_desc: "Tracing Problems are exercises where you need to predict the output of a given program. Each cell represents a tracing problem and the color of the cell shows your ",
            progress: "Progress",
            performance: "Performance",
            progress_desc: "Gray means 0% {metric} and darker colors mean higher {metric}.",
            both_desc: "both progress and performance. Gray means 0% progress/performance and darker colors mean higher progress/performance. If you solve a problem correctly (at least once), your progress will be 100% for that problem (left rectangle). In addition, your performance will be calculated by the system based on your understanding of programming constructs (estimated by the system) in each problem (right rectangle). Solving more problems that contain similar constructs (e.g., if-else, for-loops) will increase your performance. Your average performance is summarized for each topic based on problems (Tracing and Parsons problems) and visualized in 'Me' row.",
            parsons_problems_title: "Parsons Problems",
            parsons_problems_desc: "Parsons Problems are code construction exercises where you need to arrange code lines in the correct order. Each cell represents a Parsons problem and the color of the cell shows your ",
            coding_title: "Coding",
            coding_desc: "Coding are coding exercises where you need to write a partial program for a given goal. ",
            group_comparison_title: "Group I would like to compare my progress to ...",
            group_comparison_intro: "The interface below shows how your progress compares with a group of students in your class. You can change your comparison group at any time to:",
            group_comparison_lower: "You are comparing your progress to the average progress of students in the lower third of the class (when sorted by average percentage of completed activities).",
            group_comparison_middle: "You are comparing your progress to the average progress of students in the middle third of the class (when sorted by average percentage of completed activities).",
            group_comparison_higher: "You are comparing your progress to the average progress of students in the higher third of the class (when sorted by average percentage of completed activities).",
            group_comparison_intro_half: "The interface below shows how your progress compares with a group of students in your class. You can change your comparison at any time to one of the options:",
            group_comparison_lower_half: "You are comparing your progress to the average progress of students in the lower half of the class (when sorted by average percentage of completed activities).",
            group_comparison_average: "You are comparing your progress to the average progress of all students in your class.",
            group_comparison_higher_half: "You are comparing your progress to the average progress of students in the higher half of the class (when sorted by average percentage of completed activities).",
            practice_goal: {
                title: "Practice Goal Help",
                text: "Setting a practice goal helps you stay motivated and track your progress.",
                how_to_use: "How to use:",
                steps: [
                    "Set a goal for the number of activities you want to complete.",
                    "Track your progress visually as you complete activities.",
                    "When you select your peers (using the slider), the system shows how many activities you need to complete to move to closer to them.",
                    "Adjust your goal and peers as needed to stay on track.",
                    "Adjust your goal as needed to stay on track."
                ],
                consistent_practice: "Consistent practice is key to improving your skills!"
            }
        },
        error: {
            not_found: "Not found",
            actLoadRec_notFound: "Due to an error the activity you have selected is not available at this time despite being on the recommended list. Please select a different activity."
        },
        tbar: {
            enabled: "Enabled",
            disabled: "Disabled",
            user_manual: "User Manual",
            book: "Big Java Book",
            book_full: "Big Java Book (ereader + quizzes)",
            questionnaire: "Questionnaire",
            questionnaire_days: "Questionnaire (expires in ${days} days)",
            group_average: "Class Average",
            middle_third: "Middle third",
            lower_third: "Lower third",
            higher_third: "Higher third",
            lower_progress: "Lower progress",
            higher_progress: "Higher progress",
            top_1: "Top 1"
        },
        announcement: {
            peer_selection_fixed: "Dear Students, we have RESOLVED a technical problem related to the peer selection. <br/>Even if you have selected your desired peers, the visualization was not reflecting your selection properly. <br/>Now, the peer selection should work as intended.<br/>Thanks for your understanding!"
        },
        group_select: {
            title_control: "Group I would like to compare my progress to ...",
            title_adaptive: "Dynamic comparison group based on my progress",
            title_slider: "Peers that I want to compare my ${metric}...",
            options: "Progress Comparison Options",
            help_control: {
                intro: "",
                lower: "",
                middle: "",
                higher: "",
                lower_half: "",
                average: "",
                higher_half: "",
                random_assignment: ""
            },
            help_adaptive: {
                intro: "This slider is designed for you to see your current position among your comparison peers and among your classmates.",
                red_bar: '<p><b><span style="color:green">Green</span></b> colored vertical bar shows your current position in the class on 0-100 axis. <br/>The closer the bar to 100 means that your progress is closer to the highest progress among your classmates <br/>',
                auto: '<p>The system automatically adapts to <b>your progress change</b> and selects the most suitable comparison peers for you. <br/>The selected comparison peers shown by the <b><span style="color:blue">blue</span></b> colored horizontal bar</p>'
            },
            help_slider: {
                intro: "Select your comparison peers using the slider.",
                red_bar: '<p><b><span style="color:green">Green</span></b> vertical bar <image id="group-selector-help" width="4" height="15" src="img/green_vertical_bar.png"> shows your current position in the class (0-100 scale). The closer the bar is to 100, the closer your ${metric} is to the top of the class.</p>',
                turquoise_bar: '<p>Your selected peers are shown by the <b><span style="color:blue">blue</span></b> horizontal bar. The system updates your comparison peers and your position automatically as your ${metric} changes.</p>',
                drag: "Drag the handles or the group bar to adjust your comparison group.",
                note: '<p><b>Note:</b> As you complete more activities, your progress increases and the green vertical bar moves to the right, showing your improved position among your classmates.</p>'
            },
            help_disable: "You have disabled progress comparison features. You only see your progress.<br/> To enable progress comparison features, please choose another comparison option.",
            help_peer: "In this option, you can select specific peers to compare your progress. You can use this option only after providing your consent to share your full-name and progress with your classmates. <p>After providing your consent, you can select your peers by their full names. After selecting, click on 'Save Peers' to save your selections. In this option, you only see peers that provided their consent already.</p>"
        },
        comparison_option: {
            disable: "Disable comparison",
            disable_label: "Comparison disabled",
            slider: "Select progress range",
            peer: "Select specific peers"
        },
        misc: {
            ok: "OK"
        },
        peer: {
            consent_prompt: "To use this feature, please give your consent to share your name and progress with your classmates.",
            no_peers: "No peers to select. None of your classmates have provided their consent yet, check back later.",
            peers_selected: "${count} peers selected",
            no_peers_selected: "No peers selected", 
            btn: {
                none: "Select None",
                all: "Select All",
                close: "Close",
                show: "Show Class List"
            },
            me: "Me",
            consent_info: "You can select your peers by their full names. You can only see students who gave their consent to share their names and in-system progress explicitly.",
            consent_enable: "To enable this functionality, you also need to give your consent to share your full name and in-system progress.",
            consent_checkbox: "I agree to share my full name and in-system progress."
        },
        progress_gap: {
            activities_plural: "activities",
            activities_singular: "activity",
            sessions_plural: "sessions",
            sessions_singular: "session",
            complete_to_improve: "Your comparison peers completed <span class=\"highlighted-value-default\">${count} ${activityWord}</span> more on average. Complete more <span class=\"highlighted-value\" title=\"Completing 2 activities increases your progress by about 1%. On average, students complete 10 activities in a 30-minute session.\">activities</span> to improve your skills and move closer to the peers you have selected.",
            alert_invalid_goal: "Please enter a valid goal greater than 0.",
            consider_higher_peers: "Consider selecting peers with higher progress (move the sliders to the right). Comparing to higher-progress peers can help you set a more challenging goal.",
            try_closer_peers: "Try choosing peers whose progress is closer to yours (move sliders closer to the red bar) for a more meaningful comparison.",
            set_practice_goal: "Set Practice Goal",
            good_job: "Good job! You've completed your goal!",
            set_new_goal: "Set a new goal to keep progressing!",
            feedback: {
                title: "We value your feedback!",
                prompt: "How did you set your practice goal?",
                placeholder: "- I liked this feature because ...\n- I would improve this feature by ...",
                select_option: "Select an option",
                please_specify: "Please specify...",
                options: {
                    challenge_myself: "I wanted to challenge myself and set a higher goal",
                    comfortable_pace: "I set a goal that feels comfortable and achievable for me",
                    teacher_guidance: "I followed my instructor's or friends' recommendation",
                    peer_inspiration: "I was inspired by seeing others' progress",
                    peers_higher: "I set a goal to catch up with higher-progress peers",
                    other: "Other"
                }
            }
        },
        ranked_list: {
            show: "Show ${metric} ranked list",
            hide: "Hide ${metric} ranked list"
        },
        practice_goal: {
            random: [
                "Set a practice goal to help you stay motivated and keep improving at your own pace.",
                "Set a practice goal to stay motivated and work steadily towards improvement.",
                "Set a goal to continue improving your skills and progressing at your own pace.",
                "Setting a practice goal can help you stay focused and engaged.",
                "Define a practice goal to track your progress and stay engaged in your learning journey."
            ]
        },
        grid: {
            me_vs_group: "Me vs. group",
            me_versus_group: "Me versus group",
            me_vs_comp_group: "Me vs. ${comparison_group}",
            group: "Group",
            group_with_title: "Group (${groupTitle})",
            peer_group: "Peer group",
            dynamic_group: "Dynamic group",
            my_peer_group: "my peer group",
            my_metric_vs_group: "My ${comparison_metric} vs average ${comparison_metric} of ${groupName}",
            my_metric: "My ${comparison_metric}",
            my_progress: "My progress",
            students_in_group: "Students in ${groupName} group",
            ranked_list_group: "Ranked list of students in ${groupName} group based on ${comparison_metric}",
            show_ranked_list: "Show ${comparison_metric} ranked list",
            hide_ranked_list: "Hide ${comparison_metric} ranked list",
            back_to_topics: "BACK TO TOPICS",
            overall: "OVERALL",
            not_here: "(you are not here)",
            you_are_ranked: "(you are ${ordinal_rank} out of ${total})",
            my_progress_grid_desc: "This grid represents your progress in the topics. Each topic is a column. First row shows <b>average</b> across different types of content. Other rows shows progress within specific types of content (quizzes, examples). Gray means 0% progress and darker color means more progress."
        },
        tooltip: {
            due_date_passed: "Due date passed",
            due_date: "Due date: ${dueDate}",
            due_for_credit: "(for course credit)",
            topic_locked_future: "This topic will be opened later by your instructor.",
            group_value: "Group ${repLevelName}: ${groupPercent}%",
            you_value: "${repLevelName}: ${yourPercent}%"
        },
        status: {
            credit: {
                full: "You have earned full credit for this topic.",
                half: "You have earned half credit for this topic.",
                none: "You have not earned credit for this topic yet.",
                for_course: "for course credit"
            },
            peers_selected: "peers selected"
        },
        timeline: {
            header: "Timeline",
            current: "Current",
            covered: "Covered",
            not_here: "You are not here",
            you_are_ranked: "You are ${ordinal_rank} out of ${total}"
        },
        legend: {
            group_plus: "group +",
            you_plus: "you +"
        },
        toolbar: {
            progress_comparison: "Progress Comparison",
            report_level: "Report level",
            topic_size: "Topic size",
            equal: "Equal",
            resource: "Resource"
        },
        activity: {
            original: "1. The original activity",
            recommended: "2. Recommended activities",
            recommended_title: "This list below shows activities which might help you with the activity you have just had an incorrect result with. This selection is based on the history of your interaction with activities (including the very last one).",
            how_difficult: "How difficult has this activity been for you?",
            easy: "Easy",
            medium: "Medium",
            hard: "Hard",
            not_sure: "Not sure",
            no: "No",
            yes: "Yes",
            feedback_help: "Your feedback will help to improve the way we track your progress and consequently suggest better activities to you and other learners."
        },
        questionnaire: {
            expires_in: "expires in"
        },
        incentives: {
            required_exercises_completed: "Required exercises completed in ${requirements_satisfied}/${total_required_topics} topics"
        }
    },
    es: {
        title: {
            others: "Lista clasificada de estudiantes en la clase",
            group: "Estudiantes en la clase",
            topic_activity: "tópico: <b>${topic}</b> &nbsp; &bull; &nbsp; Actividad: <b>${activity}</b>",
            topic: "tópico"
        },
        button: {
            close: "cerrar",
            close_window: "Cerrar ventana",
            hide: "Ocultar",
            show: "Mostrar",
            set_goal: "Establecer meta",
            set_a_goal: "Establecer una meta",
            submit_feedback: "Enviar comentarios",
            enable: "Habilitar",
            disable: "Deshabilitar",
            show_peers: "Mostrar compañeros",
            all: "Todos",
            none: "Ninguno",
            save_peers: "Guardar compañeros",
            loading: "Cargando...",
        },
        help: {
            animated_examples: "Ayuda de Ejemplos Animados",
            animated_examples_link: "Página de ayuda de Ejemplos Animados",
            help: "Ayuda",
            color_scale: "Escala de colores",
            extra_points: "Puntos extra",
            credit: "Crédito",
            half_credit: "Medio crédito",
            no_credit: "Sin crédito",
            lock: "Bloqueado",
            metric: {
                grid: "Mi Cuadro de {metric}",
                progress_grid: "Mi Cuadro de Progreso",
                comparison_grid: "Cuadro de Comparación",
                group_grid: "Cuadro del Grupo",
                group_progress: "Progreso del grupo"
            },
            metric_description: {
                me: "Esta fila representa tu {metric} en los tópicos del curso. Cada tópico es una celda. El gris significa 0% de {metric} en el tópico y un color más oscuro significa mayor {metric}.",
                mevsgrp: "Esta fila muestra la <i>diferencia</i> entre tu {metric} y el promedio de {metric} de otros estudiantes en {groupName}. El color <span style='color: #006d2c;font-weight:bold;'>VERDE</span> significa que tienes mayor {metric} que los demás y el color <span style='color: #08519c;font-weight:bold;'>AZUL</span> significa lo contrario. El gris significa {metric} igual.",
                grp: "Esta fila muestra el promedio de {metric} de otros estudiantes en {groupName} usando colores <span style='color: #08519c;font-weight:bold;'>AZULES</span>. El gris significa 0% de {metric} en el tópico y un color más oscuro significa mayor {metric}."
            },
            progress_grid_description: "Esta cuadrícula representa tu progreso en los tópicos. Cada tópico es una columna. La primera fila muestra el promedio entre diferentes tipos de contenido. Otras filas muestran el progreso dentro de tipos específicos de contenido (cuestionarios, ejemplos). El gris significa 0% de progreso y un color más oscuro significa más progreso.",
            comparison_grid_description: "Esta cuadrícula muestra la <i>diferencia</i> entre tu progreso (<span style='color: #006d2c;font-weight:bold;'>VERDE</span>) y el progreso de otros estudiantes (<span style='color: #08519c;font-weight:bold;'>AZUL</span>). El color de la celda depende de esta diferencia: si ves una celda verde, significa que estás más avanzado que el promedio de otros estudiantes en el tópico correspondiente.",
            group_progress_description: "Esta cuadrícula muestra el promedio de progreso de otros estudiantes en la clase. Dependiendo de la configuración de Mastery Grids, los otros estudiantes pueden incluir toda la clase o los estudiantes con mejores resultados usando colores <span style='color: #08519c;font-weight:bold;'>AZULES.</span>",
            extra_points_announcement: "Anuncio de Puntos Extra",
            extra_points_description: "Este número refleja los puntos extra que has ganado en rondas previas de ejercicios extra y en la ronda actual. <br/>Puedes seguir practicando en tópicos de rondas previas (tópicos sin marca de verificación). <br/>Sin embargo, tus actividades en estos tópicos anteriores no cambiarán los puntos extra que ya ganaste en esas rondas.",
            topic_opening: "Apertura de tópico",
            topic_opening_desc: " significa que el tópico no está disponible por ahora.",
            animated_examples_title: "Ejemplos animados",
            animated_examples_not_graded: "No cuenta para la nota",
            animated_examples_desc: "Los Ejemplos Animados ofrecen visualización paso a paso de la ejecución del programa. Cada celda representa un ejemplo animado y el color de la celda muestra tu progreso. El gris significa 0% de progreso y los colores más oscuros significan mayor progreso.",
            examples_challenges_title: "Ejemplos-Retos",
            examples_challenges_desc: "Los Ejemplos-Retos consisten en un ejemplo de código y varios retos donde necesitas encontrar las líneas de código que faltan. Cada celda representa un set de ejemplo-reto y el color de la celda muestra tu progreso. El gris significa 0% de progreso y los colores más oscuros significan mayor progreso.",
            tracing_problems_title: "Problemas de rastreo",
            tracing_problems_desc: "Los problemas de rastreo son ejercicios donde necesitas predecir la salida de un programa dado. Cada celda representa un problema de rastreo y el color de la celda muestra tu ",
            progress: "Progreso",
            performance: "Desempeño",
            progress_desc: "El gris significa 0% de {metric} y los colores más oscuros significan mayor {metric}.",
            both_desc: "tanto progreso como desempeño. El gris significa 0% de progreso/desempeño y los colores más oscuros significan mayor progreso/desempeño. Si resuelves correctamente un problema (al menos una vez), tu progreso será del 100% para ese problema (rectángulo izquierdo). Además, tu desempeño será calculado por el sistema en base a tu comprensión de los conceptos de programación (estimado por el sistema) en cada problema (rectángulo derecho). Resolver más problemas con conceptos similares (por ejemplo, if-else, bucles) aumentará tu desempeño. Tu desempeño promedio se resume para cada tópico según los problemas (de rastreo y de Parsons) y se visualiza en la fila 'Yo'.",
            parsons_problems_title: "Problemas Parsons",
            parsons_problems_desc: "Los Problemas Parsons son ejercicios de construcción de código donde necesitas organizar las líneas de código en el orden correcto. Cada celda representa un problema Parsons y el color de la celda muestra tu ",
            coding_title: "Codificación",
            coding_desc: "Las actividades de codificación son ejercicios donde necesitas escribir un programa parcial para un objetivo dado. ",
            group_comparison_title: "Grupo con el que me gustaría comparar mi progreso ...",
            group_comparison_intro: "La interfaz a continuación muestra cómo tu progreso se compara con un grupo de estudiantes de tu clase. Puedes cambiar tu grupo de comparación en cualquier momento a:",
            group_comparison_lower: "Estás comparando tu progreso con el promedio de los estudiantes en el tercio inferior de la clase (ordenados por porcentaje promedio de actividades completadas).",
            group_comparison_middle: "Estás comparando tu progreso con el promedio de los estudiantes en el tercio medio de la clase (ordenados por porcentaje promedio de actividades completadas).",
            group_comparison_higher: "Estás comparando tu progreso con el promedio de los estudiantes en el tercio superior de la clase (ordenados por porcentaje promedio de actividades completadas).",
            group_comparison_intro_half: "La interfaz a continuación muestra cómo tu progreso se compara con un grupo de estudiantes de tu clase. Puedes cambiar tu comparación en cualquier momento a una de las opciones:",
            group_comparison_lower_half: "Estás comparando tu progreso con el promedio de los estudiantes en la mitad inferior de la clase (ordenados por porcentaje promedio de actividades completadas).",
            group_comparison_average: "Estás comparando tu progreso con el promedio de todos los estudiantes de tu clase.",
            group_comparison_higher_half: "Estás comparando tu progreso con el promedio de los estudiantes en la mitad superior de la clase (ordenados por porcentaje promedio de actividades completadas).",
            practice_goal: {
                title: "Ayuda para la meta de práctica",
                text: "Establecer una meta de práctica te ayuda a mantenerte motivado y seguir tu progreso.",
                how_to_use: "Cómo usar:",
                steps: [
                    "Establece una meta para la cantidad de actividades que deseas completar.",
                    "Sigue tu progreso visualmente a medida que completas actividades.",
                    "Cuando seleccionas a tus compañeros (usando el control deslizante), el sistema muestra cuántas actividades necesitas completar para acercarte a ellos.",
                    "Ajusta tu meta y compañeros según sea necesario para mantenerte en camino.",
                    "Ajusta tu meta según sea necesario para mantenerte en camino."
                ],
                consistent_practice: "¡La práctica constante es clave para mejorar tus habilidades!"
            }
        },
        error: {
            not_found: "No encontrado",
            actLoadRec_notFound: "Debido a un error, la actividad que ha seleccionado no está disponible en este momento a pesar de estar en la lista de recomendaciones. Por favor, seleccione otra actividad."
        },
        tbar: {
            enabled: "Habilitado",
            disabled: "Deshabilitado",
            user_manual: "Manual de usuario",
            book: "Libro de Java",
            book_full: "Libro de Java (lector electrónico + cuestionarios)",
            questionnaire: "Cuestionario",
            questionnaire_days: "Cuestionario (expira en ${days} días)",
            group_average: "Promedio de la clase",
            middle_third: "Tercer medio",
            lower_third: "Tercer inferior",
            higher_third: "Tercer superior",
            lower_progress: "Progreso bajo",
            higher_progress: "Progreso alto",
            top_1: "Mejores 1"
        },
        announcement: {
            peer_selection_fixed: "Estimados estudiantes, hemos RESUELTO un problema técnico relacionado con la selección de compañeros. <br/>Incluso si seleccionaste tus compañeros deseados, la visualización no reflejaba correctamente tu selección. <br/>Ahora, la selección de compañeros debería funcionar como se espera.<br/>¡Gracias por su comprensión!"
        },
        group_select: {
            title_control: "Grupo con el que me gustaría comparar mi progreso ...",
            title_adaptive: "Grupo de comparación dinámico basado en mi progreso",
            title_slider: "Compañeros con los que quiero comparar mi ${metric}...",
            options: "Opciones de comparación de progreso",
            help_control: {
                intro: "La interfaz a continuación muestra cómo tu progreso se compara con un grupo de estudiantes en tu clase. Puedes cambiar tu grupo de comparación en cualquier momento a:",
                lower: "<b>Tercer inferior:</b> Comparas tu progreso con el promedio del tercer inferior de la clase (ordenados por porcentaje promedio de actividades completadas).",
                middle: "<b>Tercer medio:</b> Comparas tu progreso con el promedio del tercer medio de la clase (ordenados por porcentaje promedio de actividades completadas).",
                higher: "<b>Tercer superior:</b> Comparas tu progreso con el promedio del tercer superior de la clase (ordenados por porcentaje promedio de actividades completadas).",
                lower_half: "<b>Progreso bajo:</b> Comparas tu progreso con el promedio del medio inferior de la clase (ordenados por porcentaje promedio de actividades completadas).",
                average: "<b>Promedio de la clase:</b> Comparas tu progreso con el promedio de todos los estudiantes de la clase.",
                higher_half: "<b>Progreso alto:</b> Comparas tu progreso con el promedio del medio superior de la clase (ordenados por porcentaje promedio de actividades completadas).",
                random_assignment: "El grupo <b style='background-color: lightskyblue;'>${group}</b> fue seleccionado <b>aleatoriamente</b> para ti al principio del curso, pero puedes cambiar tu grupo de comparación en cualquier momento."
            },
            help_adaptive: {
                intro: "Este control deslizante está diseñado para que veas tu posición actual entre tus compañeros de comparación y entre tus compañeros de clase.",
                red_bar: "La barra vertical <b><span style=\"color:green\">verde</span></b> muestra tu posición actual en la clase en una escala de 0 a 100. <br/>Cuanto más cerca esté la barra de 100, significa que tu progreso está más cerca del mayor progreso de la clase.<br/>",
                auto: "El sistema se adapta automáticamente a <b>tu cambio de progreso</b> y selecciona los compañeros de comparación más adecuados para ti. <br/>Los compañeros seleccionados se muestran con la barra horizontal <b><span style=\"color:blue\">azul</span></b>."
            },
            help_slider: {
                intro: "Selecciona tus compañeros de comparación usando el control deslizante.",
                red_bar: "<p>La barra vertical <b><span style=\"color:green\">verde</span></b> <image id=\"group-selector-help\" width=\"4\" height=\"15\" src=\"img/green_vertical_bar.png\"> muestra tu posición actual en la clase (escala 0-100). Cuanto más cerca está la barra de 100, más cerca está tu ${metric} del máximo de la clase.</p>",
                turquoise_bar: "<p>Tus compañeros seleccionados se muestran con la barra horizontal <b><span style=\"color:blue\">azul</span></b>. El sistema actualiza tus compañeros de comparación y tu posición automáticamente a medida que cambia tu ${metric}.</p>",
                drag: "Arrastra los controles o la barra de grupo para ajustar tu grupo de comparación.",
                note: "<b>Nota:</b> Al completar más actividades, tu progreso aumenta y la barra verde se mueve a la derecha, mostrando tu mejor posición entre tus compañeros."
            },
            help_disable: "Has deshabilitado las funciones de comparación de progreso. Solo ves tu progreso.<br/> Para habilitar las funciones de comparación, por favor elige otra opción de comparación.",
            help_peer: "En esta opción, puedes seleccionar compañeros específicos para comparar tu progreso. Solo puedes usar esta opción después de dar tu consentimiento para compartir tu nombre completo y progreso con tus compañeros. <p>Después de dar tu consentimiento, puedes seleccionar a tus compañeros por sus nombres completos. Después de seleccionarlos, haz clic en 'Guardar compañeros' para guardar tus selecciones. En esta opción, solo verás compañeros que ya han dado su consentimiento.</p>"
        },
        comparison_option: {
            disable: "Deshabilitar comparación",
            disable_label: "Comparación deshabilitada",
            slider: "Seleccionar rango de progreso",
            peer: "Seleccionar compañeros específicos"
        },
        misc: {
            ok: "OK"
        },
        peer: {
            consent_prompt: "Para usar esta función, por favor da tu consentimiento para compartir tu nombre y progreso con tus compañeros.",
            no_peers: "No hay compañeros para seleccionar. Ningún compañero ha dado su consentimiento todavía, vuelve a intentarlo más tarde.",
            peers_selected: "${count} compañeros seleccionados",
            no_peers_selected: "Ningún compañero seleccionado",
            btn: {
                none: "Seleccionar ninguno",
                all: "Seleccionar todos",
                close: "Cerrar",
                show: "Mostrar lista de la clase"
            },
            me: "Yo",
            consent_info: "Puedes seleccionar a tus compañeros por sus nombres completos. Solo puedes ver a los estudiantes que han dado su consentimiento explícito para compartir sus nombres y progreso en el sistema.",
            consent_enable: "Para habilitar esta funcionalidad, también debes dar tu consentimiento para compartir tu nombre completo y progreso en el sistema.",
            consent_checkbox: "Acepto compartir mi nombre completo y mi progreso en el sistema."
        },
        progress_gap: {
            activities_plural: "actividades",
            activities_singular: "actividad",
            sessions_plural: "sesiones",
            sessions_singular: "sesión",
            complete_to_improve: "Tus compañeros de comparación completaron <span class=\"highlighted-value-default\">${count} ${activityWord}</span> más en promedio. Completa más <span class=\"highlighted-value\" title=\"Completar 2 actividades aumenta tu progreso aproximadamente un 1%. En promedio, los estudiantes completan 10 actividades en una sesión de 30 minutos.\">actividades</span> para mejorar tus habilidades y acercarte a los compañeros que tú seleccionaste.",
            alert_invalid_goal: "Por favor ingresa una meta válida mayor que 0.",
            consider_higher_peers: "Considera seleccionar compañeros con mayor progreso (mueve los controles deslizantes a la derecha). Compararte con compañeros de mayor progreso puede ayudarte a establecer una meta más desafiante.",
            try_closer_peers: "Intenta elegir compañeros cuyo progreso esté más cerca del tuyo (mueve los controles deslizantes más cerca de la barra roja) para una comparación más significativa.",
            set_practice_goal: "Establecer meta de práctica",
            good_job: "¡Buen trabajo! ¡Has completado tu meta!",
            set_new_goal: "¡Establece una nueva meta para seguir progresando!",
            feedback: {
                title: "¡Valoramos tus comentarios!",
                prompt: "¿Cómo estableciste tu meta de práctica?",
                placeholder: "- Me gustó esta función porque ...\n- Mejoraría esta función así ...",
                select_option: "Selecciona una opción",
                please_specify: "Por favor especifica...",
                options: {
                    challenge_myself: "Quise desafiarme y establecer una meta más alta",
                    comfortable_pace: "Puse una meta que me pareció cómoda y alcanzable",
                    teacher_guidance: "Seguí la recomendación de mi profesor/a o amigos",
                    peer_inspiration: "Me inspiré al ver el progreso de otros",
                    peers_higher: "Me propuse alcanzar a compañeros con mayor progreso",
                    other: "Otro"
                }
            }
        },
        ranked_list: {
            show: "Mostrar lista ordenada de ${metric}",
            hide: "Ocultar lista ordenada de ${metric}"
        },
        practice_goal: {
            random: [
                "Establece una meta de práctica para mantenerte motivado y seguir mejorando a tu propio ritmo.",
                "Establece una meta de práctica para mantenerte motivado y avanzar hacia la mejora.",
                "Fija una meta para continuar mejorando tus habilidades y progresar a tu propio ritmo.",
                "Establecer una meta de práctica puede ayudarte a mantenerte enfocado y comprometido.",
                "Define una meta de práctica para seguir tu progreso y mantenerte involucrado en tu aprendizaje."
            ]
        },
        grid: {
            me_vs_group: "Yo vs. grupo",
            me_versus_group: "Yo versus grupo",
            me_vs_comp_group: "Yo vs. ${comparison_group}",
            group: "Grupo",
            group_with_title: "Grupo (${groupTitle})",
            peer_group: "Compañeros",
            dynamic_group: "Dinámico",
            my_peer_group: "mi grupo de compañeros",
            my_metric_vs_group: "Mi ${comparison_metric} vs promedio de ${comparison_metric} de ${groupName}",
            my_metric: "Mi ${comparison_metric}",
            my_progress: "Mi progreso",
            students_in_group: "Estudiantes en el grupo ${groupName}",
            ranked_list_group: "Lista ordenada de estudiantes en el grupo ${groupName} basada en ${comparison_metric}",
            show_ranked_list: "Mostrar lista ordenada de ${comparison_metric}",
            hide_ranked_list: "Ocultar lista ordenada de ${comparison_metric}",
            back_to_topics: "VOLVER A tópicoS",
            overall: "GENERAL",
            not_here: "(no estás aquí)",
            you_are_ranked: "(eres el ${ordinal_rank} de ${total})",
            my_progress_grid_desc: "Esta cuadrícula representa tu progreso en los tópicos. Cada tópico es una columna. La primera fila muestra el <b>promedio</b> entre los diferentes tipos de contenido. Otras filas muestran el progreso en tipos específicos de contenido (cuestionarios, ejemplos). El gris significa 0% de progreso y los colores más oscuros indican mayor progreso."
        },
        tooltip: {
            due_date_passed: "Fecha de entrega pasada",
            due_date: "Fecha de entrega: ${dueDate}",
            due_for_credit: "(para crédito del curso)",
            topic_locked_future: "Este tópico será abierto más adelante por tu profesor.",
            group_value: "Grupo ${repLevelName}: ${groupPercent}%",
            you_value: "${repLevelName}: ${yourPercent}%"
        },
        status: {
            credit: {
                full: "Has obtenido el crédito completo para este tópico.",
                half: "Has obtenido medio crédito para este tópico.",
                none: "Aún no has obtenido crédito para este tópico.",
                for_course: "para crédito del curso"
            },
            peers_selected: "compañeros seleccionados"
        },
        timeline: {
            header: "Cronología",
            current: "Actual",
            covered: "Completado",
            not_here: "No estás aquí",
            you_are_ranked: "Eres el ${ordinal_rank} de ${total}"
        },
        legend: {
            group_plus: "grupo +",
            you_plus: "tú +"
        },
        toolbar: {
            progress_comparison: "Comparación de progreso",
            report_level: "Nivel de informe",
            topic_size: "Tamaño del tópico",
            equal: "Igual",
            resource: "Recurso"
        },
        activity: {
            original: "1. La actividad original",
            recommended: "2. Actividades recomendadas",
            recommended_title: "La siguiente lista muestra actividades que podrían ayudarte con la actividad en la que acabas de tener un resultado incorrecto. Esta selección se basa en el historial de tu interacción con las actividades (incluida la última).",
            how_difficult: "¿Qué tan difícil ha sido esta actividad para ti?",
            easy: "Fácil",
            medium: "Media",
            hard: "Difícil",
            not_sure: "No estoy seguro",
            no: "No",
            yes: "Sí",
            feedback_help: "Tus comentarios ayudarán a mejorar la forma en que rastreamos tu progreso y, en consecuencia, sugerir mejores actividades para ti y otros estudiantes."
        },
        questionnaire: {
            expires_in: "expira en"
        },
        incentives: {
            required_exercises_completed: "Ejercicios requeridos completados en ${requirements_satisfied}/${total_required_topics} tópicos"
        }
    }
}