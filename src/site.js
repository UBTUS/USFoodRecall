var statePairs = [
    { name: 'ALABAMA', abbreviation: 'AL' },
    { name: 'ALASKA', abbreviation: 'AK' },
    { name: 'AMERICAN SAMOA', abbreviation: 'AS' },
    { name: 'ARIZONA', abbreviation: 'AZ' },
    { name: 'ARKANSAS', abbreviation: 'AR' },
    { name: 'CALIFORNIA', abbreviation: 'CA' },
    { name: 'COLORADO', abbreviation: 'CO' },
    { name: 'CONNECTICUT', abbreviation: 'CT' },
    { name: 'DELAWARE', abbreviation: 'DE' },
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC' },
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM' },
    { name: 'FLORIDA', abbreviation: 'FL' },
    { name: 'GEORGIA', abbreviation: 'GA' },
    { name: 'GUAM', abbreviation: 'GU' },
    { name: 'HAWAII', abbreviation: 'HI' },
    { name: 'IDAHO', abbreviation: 'ID' },
    { name: 'ILLINOIS', abbreviation: 'IL' },
    { name: 'INDIANA', abbreviation: 'IN' },
    { name: 'IOWA', abbreviation: 'IA' },
    { name: 'KANSAS', abbreviation: 'KS' },
    { name: 'KENTUCKY', abbreviation: 'KY' },
    { name: 'LOUISIANA', abbreviation: 'LA' },
    { name: 'MAINE', abbreviation: 'ME' },
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH' },
    { name: 'MARYLAND', abbreviation: 'MD' },
    { name: 'MASSACHUSETTS', abbreviation: 'MA' },
    { name: 'MICHIGAN', abbreviation: 'MI' },
    { name: 'MINNESOTA', abbreviation: 'MN' },
    { name: 'MISSISSIPPI', abbreviation: 'MS' },
    { name: 'MISSOURI', abbreviation: 'MO' },
    { name: 'MONTANA', abbreviation: 'MT' },
    { name: 'NEBRASKA', abbreviation: 'NE' },
    { name: 'NEVADA', abbreviation: 'NV' },
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH' },
    { name: 'NEW JERSEY', abbreviation: 'NJ' },
    { name: 'NEW MEXICO', abbreviation: 'NM' },
    { name: 'NEW YORK', abbreviation: 'NY' },
    { name: 'NORTH CAROLINA', abbreviation: 'NC' },
    { name: 'NORTH DAKOTA', abbreviation: 'ND' },
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP' },
    { name: 'OHIO', abbreviation: 'OH' },
    { name: 'OKLAHOMA', abbreviation: 'OK' },
    { name: 'OREGON', abbreviation: 'OR' },
    { name: 'PALAU', abbreviation: 'PW' },
    { name: 'PENNSYLVANIA', abbreviation: 'PA' },
    { name: 'PUERTO RICO', abbreviation: 'PR' },
    { name: 'RHODE ISLAND', abbreviation: 'RI' },
    { name: 'SOUTH CAROLINA', abbreviation: 'SC' },
    { name: 'SOUTH DAKOTA', abbreviation: 'SD' },
    { name: 'TENNESSEE', abbreviation: 'TN' },
    { name: 'TEXAS', abbreviation: 'TX' },
    { name: 'UTAH', abbreviation: 'UT' },
    { name: 'VERMONT', abbreviation: 'VT' },
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI' },
    { name: 'VIRGINIA', abbreviation: 'VA' },
    { name: 'WASHINGTON', abbreviation: 'WA' },
    { name: 'WEST VIRGINIA', abbreviation: 'WV' },
    { name: 'WISCONSIN', abbreviation: 'WI' },
    { name: 'WYOMING', abbreviation: 'WY' }
];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var locationCriteria = '"Nationwide"';
var searchUrl = "";
var table;

$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

function parameterGet(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&/]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

(function ($) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function (options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options);
        navItems = this;

        //attatch click listeners
        navItems.on('click', function (event) {
            event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
            $('html,body').animate({ scrollTop: sections[navID] - settings.scrollToOffset },
                settings.scrollSpeed, "easeInOutExpo", function () {
                    disableScrollFn = false;
                }
            );
        });

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function () {
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height) {
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function () {
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode) ? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }
})(jQuery);

function generateUSMap() {
    var $usmap = $('#usmap');

    $usmap.width($usmap.parent().width() * .8);
    $usmap.height($usmap.width() * .68);
    $usmap.usmap({
        'stateStyles': { fill: '#5AAC00', 'stroke': 'black', 'stroke-width': 2 },
        'stateHoverStyles': { fill: '#7BEC00' },
        'showLabels': true,
        /*'mouseoverState': {
			'HI': function (event, data) {
				//return false;
			}
		},*/
        //Mouseover logic, might be useful?

        'click': function (event, data) {
            $('html, body').animate({
                scrollTop: $("#searchHeader").offset().top - 75
            }, 500);
            var fullStateName = $.grep(statePairs, function (e) {
                return e.abbreviation === data.name;
            })[0].name;
            locationCriteria = '"' + data.name + '" distribution_pattern:"' + fullStateName + '" distribution_pattern:"Nationwide"';
            $('#searchAreaDisplay').html('Searching ' + fullStateName);
			$('#recallNoticeHeader').text("Ongoing Food Recall Notices in " + fullStateName);
            showPie(data.name);
			doSearch();

        }
    });
}

var pieChart;
function showPie(state) {
    var searchUrl = 'https://api.fda.gov/food/enforcement.json?search=state="' + state + '"&count=classification.exact';
    $.get(searchUrl, function (data) {
        var fullStateName = $.grep(statePairs, function (e) {
            return e.abbreviation === state;
        })[0].name;

        if ($("#pieContainer").css('display') == 'none') {
            $("#pieHeader").show();
            $("#pieContainer").show();
            var ctx = document.getElementById("pieChart").getContext("2d");

            var PieData = [{
                value: data.results[0].count,
                color: "rgba(255,0,0,0.2)",
                highlight: "rgba(255,0,0,1)",
                label: data.results[0].term
            },
            {
                value: data.results[1].count,
                color: "rgba(255,255,0,0.2)",
                highlight: "rgba(255,255,0,1)",
                label: data.results[1].term
            },
            {
                value: data.results[2].count,
                color: "rgba(0,255,0,0.2)",
                highlight: "rgba(0,255,0,1)",
                label: data.results[2].term
            }];
            pieChart = new Chart(ctx).Pie(PieData, {
                responsive: true
            });
        }
        else {
            pieChart.segments[0].value = data.results[0].count;
            pieChart.segments[1].value = data.results[1].count;
            pieChart.segments[2].value = data.results[2].count;
            pieChart.update();
        }
        $("#pieHeader").html(fullStateName + " statistics");

    });
}


function doSearch(myUrl) {
	$('html, body').animate({
		scrollTop: $("#recallTable").offset().top - 150
	}, 500);
	

	var searchValue = $('#searchTextbox').val().replace(/\s/g, "+");

	if (myUrl) {
		searchUrl = myUrl;
	} else {
		searchUrl = 'status:"Ongoing" AND (distribution_pattern:' + locationCriteria + ') AND (';
		if ($('#radioDesc').is(':checked')) {
			searchUrl += "product_description:" + '"' + searchValue + '"';
		} else if ($('#radioManu').is(':checked')) {
			searchUrl += "product_description:" + '"' + searchValue + '" ' + "recalling_firm:" + '"' + searchValue + '"';
		} else if ($('#radioBatc').is(':checked')) {
			searchUrl += "code_info:" + '"' + searchValue + '" ' + "product_description:" + '"' + searchValue + '"';
		} else {
			searchUrl += '"' + searchValue + '"';
		}
		searchUrl += ') AND recall_initiation_date:[';

		var currentDate = new Date();
		var previousDate;
		if ($('#radioMonth').is(':checked')) {
			previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
		} else if ($('#radioTwoMonth').is(':checked')) {
			previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate());
		} else if ($('#radioSixMonth').is(':checked')) {
			previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
		} else {
			previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 12, currentDate.getDate());
		}
		var currentDateString = (currentDate.getMonth() == 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()) + "-" + (currentDate.getMonth() == 0 ? 12 : currentDate.getMonth()) + "-" + 1;
		var previousDateString = (previousDate.getMonth() == 0 ? previousDate.getFullYear() - 1 : previousDate.getFullYear()) + "-" + (previousDate.getMonth() == 0 ? 12 : previousDate.getMonth()) + "-" + 1;

		searchUrl += previousDateString + " TO " + currentDateString + "]";
	}
	searchUrl = decodeURIComponent(searchUrl);
	console.log(searchUrl);

	var shareUrl = 'http://www.usfoodrecall.com?search=' + encodeURIComponent(searchUrl) + "/#information";

	$('#shareTwitter').attr('href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareUrl) + '&text=Recall%20Information%20for%20' + encodeURIComponent($('#searchTextbox').val()) + '&via=UBTUS');
	$('#shareFacebook').attr('href', 'https://facebook.com/sharer.php?u=' + encodeURIComponent(shareUrl));
	$('#shareGoogle').attr('href', 'https://plus.google.com/share?url=' + encodeURIComponent(shareUrl));
	$('#searchURL').val(shareUrl);

	table.ajax.reload();
}

$(document).ready(function () {

    $('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
    $(".sectiondivider").on('click', function (event) {
        $('html,body').animate({ scrollTop: $(event.target.parentNode).offset().top - 50 }, 400, "linear");
    });

    //links going to other sections nicely scroll
    $(".container a").each(function () {
        if ($(this).attr("href").charAt(0) == '#') {
            $(this).on('click', function (event) {
                event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight = $(target.attr("href")).offset().top
                $('html,body').animate({ scrollTop: targetHight - 170 }, 800, "easeInOutExpo");
            });
        }
    });

    generateUSMap();

    $(window).on('resize', function () {
        $('#usmap').replaceWith('<div id="usmap"></div>');
        generateUSMap();
    });
	
	table = $('#recallTable').DataTable( {
        "processing": true,
		"serverSide": true,
		"columns": [
			{
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
			{"data": "recall_number"},
			{"data": "product_description"},
			{"data": "reason_for_recall"}
			
		],
		"ordering": false,
		"filter": false,
		"pagingType": "simple",
		"lengthChange": false,
		"ajax": function(data, callback, settings) {
			$.ajax({
				cache: true,
				"url": "https://api.fda.gov/food/enforcement.json",
				"data": {
					"limit": data.length,
					"skip": data.start,
					"search": searchUrl
				},
				"success": function(d) {
					$('#shareDiv').show();
					callback({
						"data": d.results,
						"recordsTotal": Math.min(d.meta.results.total, 5010),
						"recordsFiltered": Math.min(d.meta.results.total, 5010)
					});
				},
				"error": function() {
					$('#shareDiv').hide();
					callback({
						"data": [],
						"recordsTotal": 0,
						"recordsFiltered": 0
					});
				}
			});
		}
    } );
	$('#recallTable tbody').on('click', 'td.details-control', function() {
		var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( formatChildRow(row.data()) ).show();
            tr.addClass('shown');
        }
		$('.scrollToFaq').click(function() {
			$('html, body').animate({
				scrollTop: $("#faqrss").offset().top
			}, 500);
		});
	});

    

    $('#searchButton').click(function () {
        doSearch();
    });

    $('#searchTextbox').keyup(function (e) {
        if (e.keyCode == 13) {
            doSearch();
            $('#searchTextbox').blur();
        }
    });

    $('#rssFeed').FeedEk({
        FeedUrl: 'http://www.fda.gov/AboutFDA/ContactFDA/StayInformed/RSSFeeds/Recalls/rss.xml',
        TitleLinkTarget: '_blank'
    });

    var sharedLink = parameterGet('search');
    if (sharedLink) {
        doSearch(sharedLink);
    }

    var fdaData = {
        labels: [],
        datasets: [
			{
			    label: "Class I",
			    fillColor: "rgba(255,0,0,0.2)",
			    strokeColor: "rgba(255,0,0,0.2)",
			    pointColor: "rgba(255,0,0,0.2)",
			    pointStrokeColor: "#fff",
			    pointHighlightFill: "#fff",
			    pointHighlightStroke: "rgba(255,0,0,1)",
			    data: []
			},
			{
			    label: "Class II",
			    fillColor: "rgba(255,255,0,0.2)",
			    strokeColor: "rgba(255,255,0,0.2)",
			    pointColor: "rgba(255,255,0,0.2)",
			    pointStrokeColor: "#fff",
			    pointHighlightFill: "#fff",
			    pointHighlightStroke: "rgba(255,255,0,1)",
			    data: []
			},
			{
			    label: "Class III",
			    fillColor: "rgba(0,255,0,0.2)",
			    strokeColor: "rgba(0,255,0,0.2)",
			    pointColor: "rgba(0,255,0,0.2)",
			    pointStrokeColor: "#fff",
			    pointHighlightFill: "#fff",
			    pointHighlightStroke: "rgba(0,255,0,1)",
			    data: []
			}
        ]
    };

    var currentDate = new Date();
    currentDate.setDate(1);
    var count = 12;

    function recursiveFillGraph(currentCount) {
        var previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        var currentDateString = (currentDate.getMonth() == 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()) + "-" + (currentDate.getMonth() == 0 ? 12 : currentDate.getMonth()) + "-" + 1;
        var previousDateString = (previousDate.getMonth() == 0 ? previousDate.getFullYear() - 1 : previousDate.getFullYear()) + "-" + (previousDate.getMonth() == 0 ? 12 : previousDate.getMonth()) + "-" + 1;
        $.get('https://api.fda.gov/food/enforcement.json?search=recall_initiation_date:[' + previousDateString + '+TO+' + currentDateString + ']&count=classification', function (data) {
            fdaData.labels.push(months[previousDate.getMonth() - 1 >= 0 ? previousDate.getMonth() - 1 : 11] + '-' + ((previousDate.getMonth() - 1 >= 0) ? (previousDate.getFullYear()) : (previousDate.getFullYear() - 1)));
            for (var index = 0; index < data.results.length; index++) {
                var item = data.results[index];
                if (item.term === 'i') {
                    fdaData.datasets[0].data.push(item.count);
                }
                if (item.term === 'ii') {
                    fdaData.datasets[1].data.push(item.count);
                }
                if (item.term === 'iii') {
                    fdaData.datasets[2].data.push(item.count);
                }
            }
            currentDate = previousDate;
            if (currentCount == 0) {

                fdaData.labels.reverse();
                fdaData.datasets[0].data.reverse();
                fdaData.datasets[1].data.reverse();
                fdaData.datasets[2].data.reverse();

                var ctx = document.getElementById("myChart").getContext("2d");
                var myNewChart = new Chart(ctx).Line(fdaData, {
                    responsive: true
                });
            } else {
                recursiveFillGraph(currentCount - 1);
            }
        }, 'json');
    }

    $('.faq-question').click(function () {
        $('.faq-answer').hide();
        $(this).siblings('.faq-answer').show();
    });

    recursiveFillGraph(12);

    $('#sortSelect').change(function () {
        sortTable();
    });

    $('#radioAsc').change(function () {
        sortTable();
    });

    $('#radioDsc').change(function () {
        sortTable();
    });
});

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

function Sort(col, dir) {
    var rows = $('#table_body tr').get();

    rows.sort(function (a, b) {
        if (col == 2) {
            var A = new Date($(a).children('td').eq(col).text().toUpperCase());
            var B = new Date($(b).children('td').eq(col).text().toUpperCase());
        }
        else {
            var A = $(a).children('td').eq(col).text().toUpperCase();
            var B = $(b).children('td').eq(col).text().toUpperCase();
        }

        if (A < B) {
            return dir == "dec" ? 1 : -1;
        }
        if (A > B) {
            return dir == "dec" ? -1 : 1;
        }
        return 0;

    });

    $.each(rows, function (index, row) {
        $('#table_body').append(row);
    });
}

function sortTable() {
    var column = $('#sortSelect').val();
    var asc;
    if ($('#radioAsc').is(':checked')) {
        asc = 'asc';
    } else {
        asc = 'dec';
    }
    Sort(column, asc);
}

function formatChildRow(d) {
		var classDesc = "";
		if (d.classification == "Class I") {
			classDesc = "Dangerous or defective products that predictably could cause serious health problems or death. Examples include: food found to contain botulinum toxin, food with undeclared allergens, a label mix-up on a lifesaving drug, or a defective artificial heart valve.";
		} else if (d.classification == "Class II") {
			classDesc = "Products that might cause a temporary health problem, or pose only a slight threat of a serious nature. Example: a drug that is under-strength but that is not used to treat life-threatening situations.";
		} else if (d.classification == "Class III") {
			classDesc = "Products that are unlikely to cause any adverse health reaction, but that violate FDA labelling or manufacturing laws. Examples include: a minor container defect and lack of English labelling in a retail food.";
		}
		return '<table border="0" style="margin: 10px; width: calc(100% - 20px); text-align: left;">'+
			'<tr>'+
				'<td>Recall Number:</td>'+
				'<td>'+d.recall_number+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Product Description:</td>'+
				'<td style="font-weight: bold;">'+d.product_description+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Reason for Recall:</td>'+
				'<td style="font-weight: bold;">'+d.reason_for_recall+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Classification:</td>'+
				'<td>'+d.classification+'&nbsp;<span title="' + classDesc + '" style="color: blue; cursor: pointer;" class="scrollToFaq"><i class="fa fa-question-circle"></i></span>'
				+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Distribution:</td>'+
				'<td>'+d.distribution_pattern+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Recall Initiation Date:</td>'+
				'<td>'+d.recall_initiation_date.insert(6, "-").insert(4, "-")+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Recalling Firm:</td>'+
				'<td>'+d.recalling_firm+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Code Info:</td>'+
				'<td>'+d.code_info+'</td>'+
			'</tr>'+
		'</table>';
	}

