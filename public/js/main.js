// Confirm before submitting a task status change
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.task-status-select').forEach((select) => {
        const original = select.value;
        select.addEventListener('change', () => {
            if (!confirm('Update the task status?')) {
                select.value = original;
                return;
            }
            select.form.submit();
        });
    });
});
