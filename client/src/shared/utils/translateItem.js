const statusKeyMap = {
    'All Tasks': 'task.allTasks',
    'Pending': 'task.statuses.pending',
    'In Progress': 'task.statuses.inProgress',
    'Completed': 'task.statuses.completed',
    'Canceled': 'task.statuses.canceled'
}

const priorityKeyMap = {
    'All Tasks': 'task.allTasks',
    'High': 'task.priorities.high',
    'Medium': 'task.priorities.medium',
    'Low': 'task.priorities.low'
}

const titleKeyMap = {
    'All Tasks': 'task.allTasks',
    'In Progress Tasks': 'statsDisplay.inProgress',
    'Deleted Tasks': 'statsDisplay.deleted',
    'Earning': 'statsDisplay.earning',
    'Current Tasks': 'statsDisplay.current',
    'Pending Tasks': 'statsDisplay.pending',
    'Completed Tasks': 'statsDisplay.completed',
    'Canceled Tasks': 'statsDisplay.canceled',
    'Log in': 'auth.login.title',
    'Register': 'auth.register.title',
    'Alternative Log In': 'auth.login.altModalTitle',
    'Reset Password': 'auth.resetPassword.title',
    'Change Password': 'auth.changePassword.title',
    'View Task': 'table.viewTask',
    'Quick Update': 'table.quickUpdate',
    'Edit task': 'table.editTask',
    'Delete task': 'table.deleteTask',
    'Delete permanently': 'table.deletePermanently',
    'Restore task': 'table.restoreTask',
    'Post a New Task': 'task.postANewTask'
}

const messageKeyMap = {
    'OTP has been sent': 'server.state.otpSent',
    'Send pin failed': 'server.state.sendPinFailed',
    'Check pin success': 'server.state.checkPinSuccess',
    'Check pin failed': 'server.state.checkPinFailed',
    'Register failed': 'server.state.registerFailed',
    'Register success': 'server.state.registerSuccess',
    'Login success': 'server.state.loginSuccess',
    'Login failed': 'server.state.loginFailed',
    'Profile can not be edited': 'server.state.profileNotEdited',
    'Profile is edited': 'server.state.profileEdited',
    'Profile is not editted': 'server.state.profileNotEdited2',
    'Task is created': 'server.state.taskCreated',
    'Task is not created': 'server.state.taskNotCreated',
    'Task is not editted': 'server.state.taskNotEdited',
    'Task is edited': 'server.state.taskEdited',
    'Task has been restored': 'server.state.taskRestored',
    'Task has not been restored': 'server.state.taskNotRestored',
    'Task has been deleted': 'server.state.taskDeleted',
    'Task has not been deleted': 'server.state.taskNotDeleted',
    'Task has been deleted permanently': 'server.state.taskDeletedPermanently',
    'There is no matched username or email.': 'server.message.noMatchedAccount',
    'Please reset your password.': 'server.message.pleaseResetPassword',
    'The Pin is not matched.': 'server.message.pinNotMatched',
    'The Pin has been expired, please click "Resend OTP".': 'server.message.pinExpired',
    'You have now logged in.': 'server.message.loggedIn',
    'Email, username or password is incorrect.': 'server.message.wrongCredentials',
    'Old password is not matched.': 'server.message.oldPasswordWrong',
    'Password is updated successfully.': 'server.message.passwordUpdated',
    'You now can view in the profile page.': 'server.message.viewInProfile',
    'You can now view it in your home page or task list.': 'server.message.viewInHomeOrList',
    'There is no task with that id.': 'server.message.taskNotFound',
    'The data has been reloaded.': 'server.message.dataReloaded',
    'You now can not view this task anymore.': 'server.message.taskGone',
    'AI suggestion failed': 'server.message.aiSuggestionFailed',
    'No token': 'server.message.noToken',
    'Invalid token': 'server.message.invalidToken'
}

const alreadyRegisteredRegex = /^This (\w+) has already registered$/

function translateItem(item, viewMode, t) {
    if (!item) return item
    if (viewMode === 'status') return statusKeyMap[item] ? t(statusKeyMap[item]) : item
    if (viewMode === 'priority') return priorityKeyMap[item] ? t(priorityKeyMap[item]) : item
    if (viewMode === 'title') return titleKeyMap[item] ? t(titleKeyMap[item]) : item
    if (viewMode === 'message') {
        if (messageKeyMap[item]) return t(messageKeyMap[item])
        const match = item.match(alreadyRegisteredRegex)
        if (match) {
            const field = match[1]
            return t('server.message.alreadyRegistered', {field: t(`auth.register.${field}`)})
        }
        return item
    }
    return item
}

export default translateItem