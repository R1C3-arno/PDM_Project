window.goToStep= function(step) {

    document.getElementById('step1-content').classList.add('hidden');
    document.getElementById('step2-content').classList.add('hidden');
    document.getElementById('step3-content').classList.add('hidden');

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}-icon`).className = 'step-icon inactive';
        document.getElementById(`step${i}-text`).className = 'step-text inactive';
    }

    document.getElementById(`step${step}-content`).classList.remove('hidden');
    document.getElementById(`step${step}-icon`).className = 'step-icon active';
    document.getElementById(`step${step}-text`).className = 'step-text active';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.loan-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.loan-type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});