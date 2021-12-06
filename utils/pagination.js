module.exports = {
  getPagination: function (url, currentPage, sizePage) {
    var paginationLinkList = [];

    if (currentPage == 1) {
      var paginationLink = url + "?page=" + 1;
      var flag = true;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var paginationLink = url + "?page=" + 2;
      var flag = false;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var flag = false;
      var paginationLink = url + "?page=" + 3;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    } else if (currentPage >= sizePage) {
      currentPage -= 2;
      var flag = false;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var flag = false;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var flag = true;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    } else {
      currentPage -= 1;
      var flag = false;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var flag = true;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);

      currentPage += 1;
      var flag = false;
      var paginationLink = url + "?page=" + currentPage;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    }

    return paginationLinkList;
  },

  getLeftPage: function (url, currentPage, sizePage) {
    var paginationLinkList = [];
    var flag = true;
    if (currentPage == 1) {
      flag = false;
      var paginationLink = url + "?page=" + 1;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    } else {
      var paginationLink = url + "?page=" + (currentPage - 1);
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    }
    return paginationLinkList;
  },

  getRightPage: function (url, currentPage, sizePage) {
    var paginationLinkList = [];
    let flag = true;
    if (currentPage >= sizePage) {
      flag = false;
    }

    if (currentPage == 1) {
      var paginationLink = url + "?page=" + 2;
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    } else {
      var paginationLink = url + "?page=" + (currentPage + 1);
      var pagination = { currentPage, paginationLink, flag };
      paginationLinkList.push(pagination);
    }
    return paginationLinkList;
  },
};
