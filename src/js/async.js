var async = function (fns) {
    (function exec (index) {
        if (!fns[index]) {
            return;
        }
        fns[index](function () {
            exec(index + 1);
        });
    })(0);
};
