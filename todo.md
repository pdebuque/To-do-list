base

create a task
[x] html structure
[x] set up database
[x] set up POST: add a task
[x] set up GET: download all tasks
[x] front-end show all results
[x] PUT: update done
[x] DELETE: delete task
[x] styling: update when task done
[x] styling: style the display
    [x] parse date info
    [x] fonts

[] styling: update the header
[x] sort incoming data by importance
[x] data validation


STRETCH
[x] tasks go into different columns for to-do and complete
    [x] to-do sorted by importance
    [x] tasks can be moved to and from using toggle done


[x] sort by importance
[x] sort by date
    [x] separate render into two functions. default called by both but called separately in sort
    [x] create two separate get functions for sort
    [x] click listeners on dom to sort

time completed
[x] new column in database: time_completed

[x] saving the time
    [x] click 'mark as done' button --> fetch current time
    [x] put request saves this time to time_completed
    [x] rendering complete includes this time
[x] unsaving the time
    [x] click 'mark not done' button --> put request clear the time_completed
    [x] render incomplete is the same

[] consolidate toggle done function for all cases

## style to-do
[x] make completed tasks smaller. focus should be on incomplete
[x] fiddle with fonts
[x] media queries to switch layouts
[x] spacing of headers
[x] spacing of new task field

[x] fix spacing of importance numbers
[x] conditional styling: colors on importance
[x] fix spacing of dropdown info
[] fix styles of toggle buttons on top (hate the blue)
[] switch check-box to check mark

## restore functionality - incomplete
[x] arm delete task button
[x] arm done checkbox button
[] create edit task functionality; arm button
[x] fix delete task function 

## restore functionality - complete






## misc
[x] clean up css classes