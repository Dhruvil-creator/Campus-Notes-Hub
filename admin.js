var app = angular.module('adminApp', []);

app.controller('AdminCtrl', function($scope, $http) {
    $scope.loggedIn = false;
    $scope.error = "";
    $scope.username = "";
    $scope.password = "";
    $scope.users = [];
    $scope.notes = [];
    $scope.activeUser = null;
    $scope.editUser = null;
    $scope.editUserUsername = "";
    $scope.editNote = null;
    $scope.editNoteData = {};

    // Session check on load
    $http.get('api/check_admin_session.php').then(function(res){
        if(res.data.admin_loggedin){
            $scope.loggedIn = true;
            $scope.fetchAll();
        }
    });

    $scope.loginAdmin = function() {
        $http.post('api/login.php', {
            username: $scope.username,
            password: $scope.password
        }).then(function(res){
            if(res.data.success){
                $scope.loggedIn = true;
                $scope.error = "";
                $scope.fetchAll();
                window.location = "index.html";
            } else {
                $scope.error = res.data.error || 'Login failed';
            }
        });
    };

    $scope.fetchAll = function() {
        $http.get('api/get_users.php').then(function(r) {
            $scope.users = Array.isArray(r.data) ? r.data : [];
        });
        $http.get('api/fetch_notes.php').then(function(r) {
            $scope.notes = Array.isArray(r.data) ? r.data : [];
        });
        $scope.activeUser = null;
        $scope.editUser = null;
        $scope.editNote = null;
    };

    $scope.showUserNotes = function(user) {
        $scope.activeUser = user;
        $scope.editNote = null;
    };
    $scope.cancelShowUserNotes = function() {
        $scope.activeUser = null;
        $scope.editNote = null;
    };

    // Edit/delete user
    $scope.startEditUser = function(user) {
        $scope.editUser = user;
        $scope.editUserUsername = user.username;
    };
    $scope.saveEditUser = function() {
        $http.post('api/admin_edit_user.php', {
            id: $scope.editUser.id,
            username: $scope.editUserUsername
        }).then(function(res){
            $scope.editUser = null;
            $scope.editUserUsername = "";
            $scope.fetchAll();
        });
    };
    $scope.cancelEditUser = function() {
        $scope.editUser = null;
        $scope.editUserUsername = "";
    };
    $scope.deleteUser = function(id) {
        if(confirm("Delete this user and all their files?")) {
            $http.post('api/admin_remove_user.php', {id: id}).then(function(res){ $scope.fetchAll(); });
        }
    };

    // Edit/delete note
   $scope.startEditNote = function(note) {
    $scope.editNote = note;
    $scope.editNoteData = angular.copy(note);
    // Ensure branch is copied to editNoteData or set to empty if missing
    $scope.editNoteData.branch = note.branch || '';
};

$scope.saveEditNote = function() {
    // Normalize branch to uppercase before sending
    if ($scope.editNoteData && $scope.editNoteData.branch) {
        $scope.editNoteData.branch = $scope.editNoteData.branch.toUpperCase().trim();
    } else {
        $scope.error = 'Branch name is required';
        return;
    }

    $http.post('api/admin_edit_note.php', $scope.editNoteData).then(function(res){
        if (res.data && res.data.success) {
            $scope.editNote = null;
            $scope.editNoteData = {};
            $scope.fetchAll();
            $scope.error = '';
        } else {
            $scope.error = res.data.error || 'Failed to save note edits';
        }
    }, function() {
        $scope.error = 'Error occurred while saving note edits';
    });
};

$scope.cancelEditNote = function() {
    $scope.editNote = null;
    $scope.editNoteData = {};
    $scope.error = '';
};

$scope.deleteNote = function(id) {
    if(confirm("Delete this note?")){
        $http.post('api/delete_note.php', {id: id}).then(function(res){ 
            $scope.fetchAll(); 
            $scope.error = '';
        }, function() {
            $scope.error = 'Error occurred while deleting note';
        });
    }
};


    // Logout
    $scope.logout = function() {
        $http.post('api/user_logout.php').then(function(){
            $scope.loggedIn = false;
            window.location = "index.html";
        });
    };
});
