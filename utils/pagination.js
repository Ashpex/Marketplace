module.exports = {
  getPagination: function (url, currentPage) {
    var paginationLinkList = [];
    if (currentPage == 1) {
      var paginationLink = url + "?page=" + 1;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var paginationLink = url + "?page=" + 2;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var paginationLink = url + "?page=" + 3;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    } else {
      currentPage -= 1;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    }

    return paginationLinkList;
  },

  getLeftPage: function (url, currentPage) {
    var paginationLinkList = [];
    if (currentPage == 1) {
      var paginationLink = url + "?page=" + 1;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    } else {
      currentPage -= 1;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    }
    return paginationLinkList;
  },

  getRightPage: function (url, currentPage) {
    var paginationLinkList = [];
    if (currentPage == 1) {
      currentPage -= 1;
      var paginationLink = url + "?page=" + 2;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    } else {
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink };
      paginationLinkList.push(pagination);
    }
    return paginationLinkList;
  },
};
