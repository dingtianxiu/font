/**
 * Created by dtx on 16/8/11.
 */

angular.module("app.login.server",[])
    .factory("login",["$http","$q",function ($http,$q) {
        return{
            goLogin: function () {
                var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: 'https://120.26.45.186:8443/petpet/login.json?userName=xiaodexiaode&password=chunbonanyuan',
                    params:{

                    }
                })
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (data) {
                        defer.reject(data)
                    });
                return defer.promise;
            },
            checkCode: function () {
                var defer = $q.defer();
                $http({
                    method: 'GET',
                    url: 'https://120.26.45.186:8443/petpet/login.json?userName=xiaodexiaode&password=chunbonanyuan',
                    params:{

                    }
                })
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (data) {
                        defer.reject(data)
                    });
                return defer.promise;
            }
        }
    }]);