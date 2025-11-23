document.addEventListener('DOMContentLoaded', () => {

    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming...',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers...',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects...',
            technology: ['C#'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming...',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming...',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];

    // === Elements ===
    const courseContainer = document.getElementById('courses');
    const totalCreditsDisplay = document.getElementById('totalCredits');
    const allBtn = document.getElementById('all');
    const wddBtn = document.getElementById('wdd');
    const cseBtn = document.getElementById('cse');

    // === Modal Elements ===
    const modal = document.getElementById("course-desc-card");
    const subject = document.getElementById("course-subject");
    const title = document.getElementById("course-title");
    const credit = document.getElementById("course-credit");
    const desc = document.getElementById("course-desc");
    const tech = document.getElementById("course-tech");
    const closeBtn = document.getElementById("close-modal");

    // === Display Courses Function ===
    function displayCourses(filteredCourses) {
        courseContainer.innerHTML = ''; // Clear container

        filteredCourses.forEach(course => {
            const card = document.createElement('div');
            card.classList.add('course-card');
            if (course.completed) card.classList.add('completed');

            // Attach details
            card.dataset.subject = `${course.subject} ${course.number}`;
            card.dataset.title = course.title;
            card.dataset.credit = course.credits;
            card.dataset.desc = course.description;
            card.dataset.tech = course.technology.join(', ');

            // Card UI
            card.innerHTML = `
                <h3>${course.subject} ${course.number}: ${course.title}</h3>
                <p><strong>Credits:</strong> ${course.credits}</p>
            `;
            courseContainer.appendChild(card);

            // Open modal on click
            card.addEventListener("click", () => {
                subject.textContent = card.dataset.subject;
                title.textContent = card.dataset.title;
                credit.textContent = "Credit: " + card.dataset.credit;
                desc.textContent = card.dataset.desc;
                tech.textContent = "Tech Focus: " + card.dataset.tech;
                modal.showModal();
            });
        });

        // Update total credits
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsDisplay.textContent = `Total Credits: ${totalCredits}`;
    }

    // === Modal Close Behavior ===
    closeBtn.onclick = () => modal.close();
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.close();
    });
    modal.addEventListener("cancel", () => modal.close());

    // === Filter Button Events ===
    allBtn.addEventListener('click', () => displayCourses(courses));
    wddBtn.addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'WDD')));
    cseBtn.addEventListener('click', () => displayCourses(courses.filter(c => c.subject === 'CSE')));

    // === Default View ===
    displayCourses(courses);

});
